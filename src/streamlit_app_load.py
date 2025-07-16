# ---------- PeerConnect Streamlit App ---------------
# Run: streamlit run app.py [-- --embed {sts|ollama}]
#
# Requires:
#   pip install streamlit requests numpy
#   pip install sentence-transformers faiss-cpu   # only for --embed sts
# ---------------------------------------------------------
import streamlit as st, requests, json, os, sys, argparse, numpy as np, math
from datetime import datetime

# ---------- command-line arg parsing ---------------------
parser = argparse.ArgumentParser(add_help=False)
parser.add_argument("--embed", choices=["sts", "ollama"], default="sts",
                    help="Embedding backend: sts = sentence-transformers (default), "
                         "ollama = Ollama /api/embeddings")
args, _ = parser.parse_known_args()
EMBED_BACKEND = args.embed

# ---------- constants ------------------------------------
STORIES_FILE        = "data_scrape/success_stories.json"
OLLAMA_URL_GEN      = "http://localhost:11434/api/generate"
OLLAMA_URL_EMBED    = "http://localhost:11434/api/embeddings"
OLLAMA_GEN_MODEL    = "llama3.2"
OLLAMA_EMBED_MODEL  = "nomic-embed-text"          
STS_MODEL_NAME      = "all-MiniLM-L6-v2"          
MAX_STORIES_SHOWN   = 1                           
SIM_THRESHOLD       = 0.15                        

# ---------- helper: JSON (handles UTF-8 BOM) -------------
def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, "r", encoding="utf-8-sig") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return default

def save_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)

# ---------- Ollama text generation -----------------------
def ollama_generate(prompt: str) -> str:
    try:
        out = requests.post(
            OLLAMA_URL_GEN,
            json={"model": OLLAMA_GEN_MODEL, "prompt": prompt, "stream": False},
            timeout=30,
        ).json()
        return out.get("response", "").strip()
    except Exception as e:
        st.error(f"Ollama generate error: {e}")
        return "[Error]"

def classify_tone(text: str) -> str:
    prompt = f"Classify the emotional tone of this entry in 1-2 words:\n\"{text}\"\nTone:"
    return ollama_generate(prompt) or "unknown"

#Decommissioned
def motivational_message(tone: str) -> str:
    prompt = (
        "You are a compassionate life-coach. "
        f"Give a short, uplifting, practical message for someone feeling '{tone}'."
    )
    return ollama_generate(prompt)

# ---------- embedding backends ---------------------------
if EMBED_BACKEND == "sts":
    from sentence_transformers import SentenceTransformer
    import faiss

    _sts_model = SentenceTransformer(STS_MODEL_NAME)
    stories     = load_json(STORIES_FILE, [])
    corpus_vecs = _sts_model.encode([s["story"] for s in stories],
                                    normalize_embeddings=True).astype("float32")
    faiss_index = faiss.IndexFlatIP(corpus_vecs.shape[1])
    if len(stories):
        faiss_index.add(corpus_vecs)

    def embed_query(text: str) -> np.ndarray:
        return _sts_model.encode([text], normalize_embeddings=True).astype("float32")

    def similar_stories(text: str, k=MAX_STORIES_SHOWN):
        if not len(stories):
            return []
        q = embed_query(text)
        sims, ids = faiss_index.search(q, min(k, len(stories)))
        return [
            stories[i]["story"]
            for i, s in zip(ids[0], sims[0])
            if s >= SIM_THRESHOLD
        ]
else:  # Ollama embedding backend
    stories        = load_json(STORIES_FILE, [])
    if len(stories):
        resp = requests.post(
            OLLAMA_URL_EMBED,
            json={"model": OLLAMA_EMBED_MODEL,
                  "prompt": [s["story"] for s in stories],
                  "stream": False},
            timeout=60,
        ).json()
        corpus_vecs = np.array(resp["embeddings"], dtype="float32")
        corpus_vecs /= np.linalg.norm(corpus_vecs, axis=1, keepdims=True)

    def embed_texts(lst):
        r = requests.post(
            OLLAMA_URL_EMBED,
            json={"model": OLLAMA_EMBED_MODEL, "prompt": lst, "stream": False},
            timeout=30,
        ).json()
        vecs = np.array(r["embeddings"], dtype="float32")
        vecs /= np.linalg.norm(vecs, axis=1, keepdims=True)
        return vecs

    def similar_stories(text: str, k=MAX_STORIES_SHOWN):
        if not len(stories):
            return []
        q = embed_texts([text])[0]
        sims = (corpus_vecs @ q).tolist()            # cosine (because unit-normed)
        top_ids = np.argsort(sims)[::-1][:k]
        return [
            stories[i]["story"]
            for i in top_ids
            if sims[i] >= SIM_THRESHOLD
        ]


# ---------- UI ------------------------------------------
st.set_page_config(page_title="PeerConnect", layout="centered")
st.title("📝 PeerConnect")
st.caption(f"Embedding backend: **{EMBED_BACKEND}**")

with st.form("diary_form"):
    text = st.text_area("How are you feeling today?", height=150)
    submitted = st.form_submit_button("Submit Entry")

if submitted and text.strip():
    with st.spinner("Analyzing tone…"):
        tone = classify_tone(text.strip())

    entry = {
        "text": text.strip(),
        "tone": tone,
        "timestamp": datetime.utcnow().isoformat(timespec="seconds"),
    }

    # make combined feedback
    with st.spinner("Generating motivation & retrieving success story…"):
        story_list = similar_stories(text)
        combined = f"#### 💡 Your current state of mind:\n\n> {tone}"
        if story_list:
            combined += "\n\n---\n\n#### 🌱 Real-life success story:\n"
            for s in story_list:
                combined += f"- {s}\n"
    st.markdown(combined)


