import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';

interface HugAnimationProps {
    isActive: boolean;
    onComplete: () => void;
    triggerPosition: { x: number; y: number };
}

const HugAnimation: React.FC<HugAnimationProps> = ({ isActive, onComplete, triggerPosition }) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    useEffect(() => {
        if (!isActive || !sketchRef.current) return;

        let isCleanedUp = false;

        const sketch = (p: p5) => {
            let engine: Matter.Engine;
            let world: Matter.World;
            let humanBody: Matter.Body;
            let arms: Matter.Body[] = [];
            let animationProgress = 0;
            let hugPhase = 0; // 0: appearing, 1: growing, 2: hugging, 3: dissolving
            let startTime: number;

            const ANIMATION_DURATION = 2500; // 2.5 seconds total
            const SKIN_COLOR = { r: 239, g: 213, b: 187, a: 220 }; // Natural skin tone
            const GLOW_COLOR = { r: 255, g: 240, b: 200, a: 80 }; // Warm golden glow
            const CLOTHING_COLOR = { r: 100, g: 149, b: 237, a: 200 }; // Soft blue clothing

            // Function to draw realistic human figure
            const drawHumanFigure = (p: p5, hugIntensity: number, alpha: number, currentTime: number) => {
                p.noStroke();

                // Head with subtle animation
                const headBob = Math.sin(currentTime * 0.003) * 2;
                p.fill(SKIN_COLOR.r, SKIN_COLOR.g, SKIN_COLOR.b, alpha);
                p.ellipse(0, -60 + headBob, 45, 50);

                // Face features
                p.fill(0, 0, 0, alpha * 0.6);
                // Eyes
                p.ellipse(-8, -65 + headBob, 3, 4);
                p.ellipse(8, -65 + headBob, 3, 4);
                // Smile that grows with hug intensity
                const smileWidth = 8 + hugIntensity * 6;
                p.noFill();
                p.stroke(0, 0, 0, alpha * 0.6);
                p.strokeWeight(2);
                p.arc(0, -55 + headBob, smileWidth, 8, 0, Math.PI);
                p.noStroke();

                // Torso with clothing
                p.fill(CLOTHING_COLOR.r, CLOTHING_COLOR.g, CLOTHING_COLOR.b, alpha);
                p.ellipse(0, 0, 55, 85);

                // Arms with progressive hugging motion
                const armSpread = p.map(hugIntensity, 0, 1, 65, 25);
                const armCurve = hugIntensity * 45;
                const armReach = hugIntensity * 15;

                // Left arm (upper and lower)
                p.push();
                p.fill(SKIN_COLOR.r, SKIN_COLOR.g, SKIN_COLOR.b, alpha);
                p.rotate(-armSpread * (Math.PI / 180));
                p.translate(-25 - armReach, -10);

                // Upper arm
                p.ellipse(0, 0, 18, 35);
                p.translate(0, 20);
                p.rotate(armCurve * (Math.PI / 180));
                // Lower arm
                p.ellipse(0, 15, 15, 30);
                // Hand
                p.ellipse(0, 28, 12, 12);
                p.pop();

                // Right arm (upper and lower)
                p.push();
                p.fill(SKIN_COLOR.r, SKIN_COLOR.g, SKIN_COLOR.b, alpha);
                p.rotate(armSpread * (Math.PI / 180));
                p.translate(25 + armReach, -10);

                // Upper arm
                p.ellipse(0, 0, 18, 35);
                p.translate(0, 20);
                p.rotate(-armCurve * (Math.PI / 180));
                // Lower arm
                p.ellipse(0, 15, 15, 30);
                // Hand
                p.ellipse(0, 28, 12, 12);
                p.pop();

                // Legs
                p.fill(CLOTHING_COLOR.r, CLOTHING_COLOR.g, CLOTHING_COLOR.b, alpha * 0.8);
                p.ellipse(-12, 60, 20, 40);
                p.ellipse(12, 60, 20, 40);

                // Feet
                p.fill(SKIN_COLOR.r - 20, SKIN_COLOR.g - 20, SKIN_COLOR.b - 20, alpha);
                p.ellipse(-12, 85, 15, 10);
                p.ellipse(12, 85, 15, 10);
            };

            p.setup = () => {
                if (!sketchRef.current) return;
                const canvas = p.createCanvas(400, 400);
                canvas.parent(sketchRef.current);

                // Initialize Matter.js
                engine = Matter.Engine.create();
                world = engine.world;
                engine.world.gravity.y = 0; // No gravity for floating effect

                startTime = p.millis();

                // Create human-like body (ellipse)
                humanBody = Matter.Bodies.circle(200, 200, 30, {
                    isStatic: true,
                    render: { fillStyle: `rgba(${SKIN_COLOR.r}, ${SKIN_COLOR.g}, ${SKIN_COLOR.b}, ${SKIN_COLOR.a})` }
                });

                // Create arms (rectangles that will animate)
                const leftArm = Matter.Bodies.rectangle(170, 200, 60, 15, {
                    isStatic: true,
                    render: { fillStyle: `rgba(${SKIN_COLOR.r}, ${SKIN_COLOR.g}, ${SKIN_COLOR.b}, ${SKIN_COLOR.a})` }
                });

                const rightArm = Matter.Bodies.rectangle(230, 200, 60, 15, {
                    isStatic: true,
                    render: { fillStyle: `rgba(${SKIN_COLOR.r}, ${SKIN_COLOR.g}, ${SKIN_COLOR.b}, ${SKIN_COLOR.a})` }
                });

                arms = [leftArm, rightArm];

                // Add bodies to world
                Matter.World.add(world, [humanBody, ...arms]);
            };

            p.draw = () => {
                const currentTime = p.millis();
                const elapsed = currentTime - startTime;
                animationProgress = Math.min(elapsed / ANIMATION_DURATION, 1);

                // Clear background with transparency
                p.clear();

                // Update animation phase
                if (animationProgress < 0.2) {
                    hugPhase = 0; // Appearing
                } else if (animationProgress < 0.4) {
                    hugPhase = 1; // Growing
                } else if (animationProgress < 0.8) {
                    hugPhase = 2; // Hugging
                } else {
                    hugPhase = 3; // Dissolving
                }

                // Calculate scale and alpha based on phase
                let scale = 1;
                let alpha = 255;
                let hugIntensity = 0;

                switch (hugPhase) {
                    case 0: // Appearing
                        scale = p.map(animationProgress, 0, 0.2, 0.3, 1);
                        alpha = p.map(animationProgress, 0, 0.2, 0, 255);
                        break;
                    case 1: // Growing
                        scale = p.map(animationProgress, 0.2, 0.4, 1, 1.3);
                        alpha = 255;
                        break;
                    case 2: // Hugging
                        scale = 1.3;
                        alpha = 255;
                        hugIntensity = p.map(animationProgress, 0.4, 0.8, 0, 1);
                        break;
                    case 3: // Dissolving
                        scale = p.map(animationProgress, 0.8, 1, 1.3, 0.8);
                        alpha = p.map(animationProgress, 0.8, 1, 255, 0);
                        hugIntensity = p.map(animationProgress, 0.8, 1, 1, 0);
                        break;
                }

                // Update Matter.js engine
                Matter.Engine.update(engine);

                // Draw warm glow effect
                p.push();
                p.translate(200, 200);
                p.scale(scale);

                // Breathing effect - subtle scale oscillation
                const breathScale = 1 + Math.sin(currentTime * 0.008) * 0.02;
                p.scale(breathScale);

                // Outer warm glow
                for (let i = 6; i > 0; i--) {
                    const glowAlpha = (alpha * 0.2) / i;
                    p.fill(GLOW_COLOR.r, GLOW_COLOR.g, GLOW_COLOR.b, glowAlpha);
                    p.noStroke();
                    p.ellipse(0, 0, (100 + i * 15), (120 + i * 15));
                }

                // Draw realistic human figure
                drawHumanFigure(p, hugIntensity, alpha, currentTime);

                p.pop();

                // Add floating warmth particles during hug phase
                if (hugPhase === 2) {
                    // Gentle floating particles around the figure
                    for (let i = 0; i < 12; i++) {
                        const angle = (currentTime * 0.003 + i * 0.5) % (Math.PI * 2);
                        const radius = 80 + Math.sin(currentTime * 0.005 + i) * 20;
                        const particleX = 200 + Math.cos(angle) * radius;
                        const particleY = 200 + Math.sin(angle) * radius + Math.sin(currentTime * 0.008 + i) * 10;
                        const particleSize = 3 + Math.sin(currentTime * 0.01 + i) * 2;

                        // Warm sparkles
                        p.fill(255, 223, 186, alpha * 0.6);
                        p.noStroke();
                        p.ellipse(particleX, particleY, particleSize, particleSize);
                    }

                    // Heart particles for emotional connection
                    for (let i = 0; i < 6; i++) {
                        const heartX = 200 + Math.cos(currentTime * 0.008 + i * 1.2) * (60 + hugIntensity * 25);
                        const heartY = 200 + Math.sin(currentTime * 0.008 + i * 1.2) * (60 + hugIntensity * 25);
                        const heartSize = 6 + hugIntensity * 3 + Math.sin(currentTime * 0.01 + i) * 1;

                        p.fill(255, 105, 180, alpha * 0.8);
                        p.noStroke();

                        // Draw heart shape
                        p.push();
                        p.translate(heartX, heartY);
                        p.scale(heartSize / 8);
                        p.beginShape();
                        for (let t = 0; t < Math.PI * 2; t += 0.15) {
                            const x = 12 * Math.pow(Math.sin(t), 3);
                            const y = -(10 * Math.cos(t) - 4 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                            p.vertex(x, y);
                        }
                        p.endShape(p.CLOSE);
                        p.pop();
                    }
                }

                // Complete animation
                if (animationProgress >= 1 && !isCleanedUp) {
                    isCleanedUp = true;
                    onComplete();
                }
            };

            p.windowResized = () => {
                // Prevent p5.js from trying to resize
                return false;
            };
        };

        p5InstanceRef.current = new p5(sketch);

        return () => {
            isCleanedUp = true;
            if (p5InstanceRef.current) {
                try {
                    p5InstanceRef.current.remove();
                } catch (error) {
                    console.warn('Error cleaning up p5 instance:', error);
                } finally {
                    p5InstanceRef.current = null;
                }
            }
        };
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            style={{
                left: triggerPosition.x - 200,
                top: triggerPosition.y - 200,
                width: 400,
                height: 400,
            }}
        >
            <div ref={sketchRef} className="relative" />
        </div>
    );
};

export default HugAnimation; 