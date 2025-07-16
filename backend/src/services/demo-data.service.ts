// Demo Data Service - Provides synthetic data for PeerConnect demo
export interface DemoUser {
    id: string;
    anonymous_id: string;
    empathy_score: number;
    interaction_score: number;
    created_at: string;
}

export interface DemoEmotion {
    primary: string;
    secondary: string[];
    intensity: number;
    empathy_potential: number;
    support_type: 'comfort' | 'energy' | 'clarity' | 'solidarity';
    crisis_indicators: string[];
    progress_indicators: string[];
    context: 'sharing' | 'seeking' | 'reflecting' | 'celebrating';
    emotional_complexity: number;
    all_emotions: { [emotion: string]: number };
}

export interface DemoPost {
    id: string;
    user_id: string;
    content: string;
    emotions: DemoEmotion;
    community_id: string;
    reaction_count: number;
    support_count: number;
    created_at: string;
    author: {
        anonymous_id: string;
        empathy_score: number;
    };
}

export interface DemoCommunity {
    id: string;
    name: string;
    description: string;
    member_count: number;
    post_count: number;
    focus_area: string;
}

class DemoDataService {
    private communities: DemoCommunity[] = [
        {
            id: 'solo-entrepreneurs',
            name: 'Solo Entrepreneurs',
            description: 'Support for entrepreneurs building alone, dealing with isolation and decision fatigue.',
            member_count: 2847,
            post_count: 1293,
            focus_area: 'Entrepreneurship & Isolation'
        },
        {
            id: 'adhd-support',
            name: 'ADHD Support Circle',
            description: 'Understanding and managing ADHD while building meaningful connections.',
            member_count: 4521,
            post_count: 2156,
            focus_area: 'ADHD & Executive Function'
        },
        {
            id: 'relationship-rebuilders',
            name: 'Relationship Rebuilders',
            description: 'Healing from relationship challenges, divorce, and rebuilding social connections.',
            member_count: 3298,
            post_count: 1847,
            focus_area: 'Relationships & Recovery'
        },
        {
            id: 'new-city-new-me',
            name: 'New City, New Me',
            description: 'Finding community and belonging after major life relocations.',
            member_count: 1876,
            post_count: 892,
            focus_area: 'Relocation & New Beginnings'
        },
        {
            id: 'career-transition',
            name: 'Career Transition Warriors',
            description: 'Support during career changes, job loss, and professional reinvention.',
            member_count: 2634,
            post_count: 1456,
            focus_area: 'Career & Professional Growth'
        }
    ];

    private posts: DemoPost[] = [
        {
            id: 'post-1',
            user_id: 'user-1',
            content: `Three years into building my startup and I'm realizing how isolating this journey really is. Everyone sees the "entrepreneur lifestyle" as glamorous, but nobody talks about the 2 AM anxiety spirals when you're making decisions that could make or break everything.

I miss having coworkers to bounce ideas off, someone to grab coffee with when things get overwhelming. My friends don't really get it - they think I'm "living the dream" while I'm here questioning every choice I make.

Some days I wonder if I'm cut out for this, but then I remember why I started. Still, the loneliness hits different when you're responsible for everything.`,
            emotions: {
                primary: 'overwhelmed',
                secondary: ['lonely', 'anxious'],
                intensity: 0.78,
                empathy_potential: 0.92,
                support_type: 'comfort',
                crisis_indicators: ['anxiety', 'decision fatigue'],
                progress_indicators: ['daily routine', 'self-care'],
                context: 'sharing',
                emotional_complexity: 0.85,
                all_emotions: {
                    overwhelmed: 0.78,
                    lonely: 0.78,
                    anxious: 0.78
                }
            },
            community_id: 'solo-entrepreneurs',
            reaction_count: 23,
            support_count: 47,
            created_at: '2024-01-20T14:30:00Z',
            author: {
                anonymous_id: 'StartupFounder2021',
                empathy_score: 84
            }
        },
        {
            id: 'post-2',
            user_id: 'user-2',
            content: `Update on my ADHD management journey: Finally found a system that works! 🎉

After months of trying different approaches, I've created this hybrid bullet journal + digital system. The key was accepting that my brain needs both structure AND flexibility.

Morning pages for brain dump → digital calendar for time blocks → physical notebook for daily tasks. It sounds complicated but it actually reduces my mental load.

The game changer was realizing I don't need to be "normal" - I need to work WITH my ADHD brain, not against it. Still have rough days, but I'm not fighting myself anymore.`,
            emotions: {
                primary: 'accomplished',
                secondary: ['hopeful', 'proud'],
                intensity: 0.65,
                empathy_potential: 0.85,
                support_type: 'energy',
                crisis_indicators: [],
                progress_indicators: ['ADHD management system'],
                context: 'sharing',
                emotional_complexity: 0.75,
                all_emotions: {
                    accomplished: 0.65,
                    hopeful: 0.65,
                    proud: 0.65
                }
            },
            community_id: 'adhd-support',
            reaction_count: 31,
            support_count: 28,
            created_at: '2024-01-20T11:15:00Z',
            author: {
                anonymous_id: 'ADHDBrainWins',
                empathy_score: 91
            }
        },
        {
            id: 'post-3',
            user_id: 'user-3',
            content: `Six months post-divorce and I'm learning to be alone without being lonely. It's harder than I expected.

The house feels too quiet. I catch myself cooking for two out of habit. Friends mean well but "you're better off without him" doesn't fill the empty space where partnership used to be.

I'm not mourning the relationship - that was over long before the papers were signed. I'm mourning the life I thought I'd have, the future I'd planned. Starting over at 34 feels simultaneously terrifying and liberating.

Taking it one day at a time. Some days are good, some aren't. Today was okay.`,
            emotions: {
                primary: 'grief',
                secondary: ['vulnerable', 'hopeful'],
                intensity: 0.82,
                empathy_potential: 0.96,
                support_type: 'comfort',
                crisis_indicators: ['loss', 'uncertainty'],
                progress_indicators: ['daily routine', 'self-care'],
                context: 'seeking',
                emotional_complexity: 0.90,
                all_emotions: {
                    grief: 0.82,
                    vulnerable: 0.82,
                    hopeful: 0.82
                }
            },
            community_id: 'relationship-rebuilders',
            reaction_count: 18,
            support_count: 52,
            created_at: '2024-01-20T09:45:00Z',
            author: {
                anonymous_id: 'NewChapterBegins',
                empathy_score: 88
            }
        },
        {
            id: 'post-4',
            user_id: 'user-4',
            content: `Made my first real friend in this new city! 🌟

It's been 8 months since I moved here for work, and honestly, making adult friends is HARD. Dating apps for friendship feel weird, meetups were hit or miss, and work colleagues are nice but we don't click outside the office.

But last week at the dog park (yes, I got a dog partly for this reason 😅), I met Sarah. We ended up talking for an hour about everything and nothing. She invited me to her book club, and it felt so natural.

For anyone else struggling with this - it really does take time. I was starting to think something was wrong with me, but sometimes you just need to find your people.`,
            emotions: {
                primary: 'grateful',
                secondary: ['relieved', 'hopeful'],
                intensity: 0.71,
                empathy_potential: 0.74,
                support_type: 'solidarity',
                crisis_indicators: [],
                progress_indicators: ['finding community'],
                context: 'sharing',
                emotional_complexity: 0.70,
                all_emotions: {
                    grateful: 0.71,
                    relieved: 0.71,
                    hopeful: 0.71
                }
            },
            community_id: 'new-city-new-me',
            reaction_count: 42,
            support_count: 19,
            created_at: '2024-01-19T16:20:00Z',
            author: {
                anonymous_id: 'DogParkDiplomat',
                empathy_score: 76
            }
        },
        {
            id: 'post-5',
            user_id: 'user-5',
            content: `Left my corporate job 3 months ago to freelance and I'm experiencing ALL the emotions.

Freedom feels amazing until 3 PM when I realize I haven't talked to another human all day. The flexibility is incredible until I'm working at 11 PM because boundaries are hard when your office is your bedroom.

Financial anxiety is real - even though I'm making decent money, the irregularity messes with my head. I miss the security of a steady paycheck, but I don't miss the soul-crushing meetings about meetings.

This transition is teaching me so much about myself. I'm more resilient than I thought, but also more social than I realized. Working on finding that balance.`,
            emotions: {
                primary: 'liberated',
                secondary: ['anxious', 'proud'],
                intensity: 0.69,
                empathy_potential: 0.79,
                support_type: 'energy',
                crisis_indicators: [],
                progress_indicators: ['freelancing', 'time management'],
                context: 'celebrating',
                emotional_complexity: 0.75,
                all_emotions: {
                    liberated: 0.69,
                    anxious: 0.69,
                    proud: 0.69
                }
            },
            community_id: 'career-transition',
            reaction_count: 27,
            support_count: 34,
            created_at: '2024-01-19T13:10:00Z',
            author: {
                anonymous_id: 'FreelanceLife2024',
                empathy_score: 82
            }
        },
        {
            id: 'post-6',
            user_id: 'user-6',
            content: `Therapy breakthrough moment: I realized I've been trying to "fix" my ADHD instead of understanding it.

My therapist asked me to describe my brain like it's a friend, not an enemy. Turns out my brain is like that friend who's incredibly creative, sees connections others miss, but also gets distracted by every shiny thing and forgets to eat lunch.

I've been so focused on my deficits that I forgot about my strengths. Yes, I struggle with executive function, but I also hyperfocus on things I love and come up with solutions others don't see.

Still need strategies and support, but now I'm working WITH my brain instead of against it. Game changer.`,
            emotions: {
                primary: 'proud',
                secondary: ['relieved', 'accomplished'],
                intensity: 0.73,
                empathy_potential: 0.88,
                support_type: 'solidarity',
                crisis_indicators: [],
                progress_indicators: ['ADHD understanding', 'strategies'],
                context: 'celebrating',
                emotional_complexity: 0.80,
                all_emotions: {
                    proud: 0.73,
                    relieved: 0.73,
                    accomplished: 0.73
                }
            },
            community_id: 'adhd-support',
            reaction_count: 38,
            support_count: 29,
            created_at: '2024-01-19T10:30:00Z',
            author: {
                anonymous_id: 'BrainFriendNotFoe',
                empathy_score: 89
            }
        },
        {
            id: 'post-7',
            user_id: 'user-7',
            content: `Two years of building my business alone and I finally hired my first employee. The relief is overwhelming.

I didn't realize how much the isolation was affecting me until I had someone to share the load with. Having another person to brainstorm with, to validate ideas, to just... be present in this journey.

The financial pressure of paying someone else is scary, but the mental health benefits are immediate. I forgot what it felt like to have a teammate.

To other solo founders considering this step: if you can afford it, do it. Even part-time help can change everything.`,
            emotions: {
                primary: 'relieved',
                secondary: ['grateful', 'hopeful'],
                intensity: 0.76,
                empathy_potential: 0.81,
                support_type: 'solidarity',
                crisis_indicators: [],
                progress_indicators: ['team', 'business growth'],
                context: 'celebrating',
                emotional_complexity: 0.78,
                all_emotions: {
                    relieved: 0.76,
                    grateful: 0.76,
                    hopeful: 0.76
                }
            },
            community_id: 'solo-entrepreneurs',
            reaction_count: 33,
            support_count: 41,
            created_at: '2024-01-18T15:45:00Z',
            author: {
                anonymous_id: 'NoLongerSolo',
                empathy_score: 85
            }
        },
        {
            id: 'post-8',
            user_id: 'user-8',
            content: `Dating after divorce is... something else. Had my first coffee date in 15 years yesterday.

I forgot how to do this. What do you talk about? How much do you share? When do you mention you have kids? The whole thing felt like learning a new language.

He was nice, we had decent conversation, but I kept comparing everything to my ex-husband. Not fair to either of us, but old habits die hard.

I think I need more time to figure out who I am on my own before I try to be half of something again. But it felt good to put myself out there, even if I'm not ready yet.`,
            emotions: {
                primary: 'vulnerable',
                secondary: ['anxious', 'hopeful'],
                intensity: 0.71,
                empathy_potential: 0.87,
                support_type: 'comfort',
                crisis_indicators: ['uncertainty', 'fear of commitment'],
                progress_indicators: ['dating process', 'self-awareness'],
                context: 'seeking',
                emotional_complexity: 0.85,
                all_emotions: {
                    vulnerable: 0.71,
                    anxious: 0.71,
                    hopeful: 0.71
                }
            },
            community_id: 'relationship-rebuilders',
            reaction_count: 22,
            support_count: 36,
            created_at: '2024-01-18T12:20:00Z',
            author: {
                anonymous_id: 'BackInTheGame',
                empathy_score: 83
            }
        }
    ];

    private users: DemoUser[] = [
        {
            id: 'user-1',
            anonymous_id: 'StartupFounder2021',
            empathy_score: 84,
            interaction_score: 78,
            created_at: '2024-01-15T10:00:00Z'
        },
        {
            id: 'user-2',
            anonymous_id: 'ADHDBrainWins',
            empathy_score: 91,
            interaction_score: 85,
            created_at: '2024-01-12T14:30:00Z'
        },
        {
            id: 'user-3',
            anonymous_id: 'NewChapterBegins',
            empathy_score: 88,
            interaction_score: 72,
            created_at: '2024-01-10T09:15:00Z'
        }
    ];

    getCommunities(): DemoCommunity[] {
        return this.communities;
    }

    getCommunity(id: string): DemoCommunity | undefined {
        return this.communities.find(c => c.id === id);
    }

    getPosts(communityId?: string): DemoPost[] {
        if (communityId) {
            return this.posts.filter(p => p.community_id === communityId);
        }
        return this.posts;
    }

    getPost(id: string): DemoPost | undefined {
        return this.posts.find(p => p.id === id);
    }

    createPost(content: string, communityId: string, userId?: string): DemoPost {
        const newPost: DemoPost = {
            id: `post-${Date.now()}`,
            user_id: userId || 'demo-user',
            content,
            emotions: this.generateRandomEmotion(),
            community_id: communityId,
            reaction_count: 0,
            support_count: 0,
            created_at: new Date().toISOString(),
            author: {
                anonymous_id: 'Anonymous User',
                empathy_score: Math.floor(Math.random() * 40) + 60
            }
        };

        this.posts.unshift(newPost);
        return newPost;
    }

    getUsers(): DemoUser[] {
        return this.users;
    }

    createUser(): DemoUser {
        const newUser: DemoUser = {
            id: `user-${Date.now()}`,
            anonymous_id: `AnonymousUser${Math.floor(Math.random() * 1000)}`,
            empathy_score: Math.floor(Math.random() * 40) + 60,
            interaction_score: Math.floor(Math.random() * 40) + 60,
            created_at: new Date().toISOString()
        };

        this.users.push(newUser);
        return newUser;
    }

    private generateRandomEmotion(): DemoEmotion {
        const emotions = [
            'hopeful', 'anxious', 'vulnerable', 'grateful', 'overwhelmed',
            'proud', 'lonely', 'accomplished', 'relieved', 'liberated'
        ];

        const primary = emotions[Math.floor(Math.random() * emotions.length)];
        const secondary = emotions
            .filter(e => e !== primary)
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 3) + 1);

        return {
            primary,
            secondary,
            intensity: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
            empathy_potential: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
            support_type: 'comfort', // Default for now
            crisis_indicators: [],
            progress_indicators: [],
            context: 'sharing', // Default for now
            emotional_complexity: 0.7, // Default for now
            all_emotions: {} // Default for now
        };
    }
}

export const demoDataService = new DemoDataService(); 