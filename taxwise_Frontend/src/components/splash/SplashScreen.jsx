import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let W = 0;
    let H = 0;
    let particles = [];
    let mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.size = Math.random() * 1.5 + 0.4;
        this.speedY = -(Math.random() * 0.35 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.life = 1;
        this.decay = Math.random() * 0.003 + 0.001;
        this.color =
          Math.random() < 0.5
            ? "rgba(212,168,83,"
            : "rgba(29,180,137,";
      }

      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80 && dist !== 0) {
          this.x += (dx / dist) * 0.3;
          this.y += (dy / dist) * 0.3;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;

        if (this.life <= 0 || this.y < -10) this.reset(false);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.life * 0.7 + ")";
        ctx.fill();
      }
    }

    particles = Array.from({ length: 120 }, () => new Particle());

    function animate() {
      ctx.clearRect(0, 0, W, H);

      const gradient = ctx.createRadialGradient(
        W * 0.2,
        H * 0.2,
        0,
        W * 0.2,
        H * 0.2,
        500
      );
      gradient.addColorStop(0, "rgba(29,180,137,0.20)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const moveHandler = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", moveHandler);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", moveHandler);
    };
  }, []);

  return (
    <>
      <style>{`
        .splash-root {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: #060809;
          color: #ede8dc;
          font-family: "Outfit", sans-serif;
        }

        .splash-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .splash-noise {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.05;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 4px 4px;
        }

        .splash-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 60px;
          animation: fadeUp 0.8s ease forwards;
        }

        .brand-box {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          border: 1px solid rgba(212,168,83,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212,168,83,0.12);
          box-shadow: 0 0 30px rgba(212,168,83,0.15);
        }

        .brand-title {
          font-size: 24px;
          font-weight: 800;
          color: #ede8dc;
        }

        .brand-title span {
          color: #d4a853;
        }

        .brand-sub {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: rgba(237,232,220,0.35);
          text-transform: uppercase;
        }

        .signin-btn {
          padding: 12px 28px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.08);
          color: white;
          cursor: pointer;
          transition: 0.25s;
        }

        .signin-btn:hover {
          transform: scale(1.08);
          background: rgba(255,255,255,0.16);
        }

        .ticker {
          position: relative;
          z-index: 10;
          height: 34px;
          border-top: 1px solid rgba(212,168,83,0.12);
          border-bottom: 1px solid rgba(212,168,83,0.12);
          overflow: hidden;
        }

        .ticker-track {
          display: flex;
          width: max-content;
          height: 100%;
          animation: marquee 22s linear infinite;
        }

        .ticker-item {
          padding: 8px 34px;
          white-space: nowrap;
          color: rgba(212,168,83,0.65);
          font-size: 13px;
          border-right: 1px solid rgba(212,168,83,0.12);
        }

        .hero {
          position: relative;
          z-index: 10;
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 24px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 22px;
          border-radius: 999px;
          border: 1px solid rgba(212,168,83,0.22);
          background: rgba(212,168,83,0.06);
          color: #d4a853;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 34px;
          animation: fadeUp 0.9s ease forwards;
        }

        .hero-title {
          font-family: Georgia, serif;
          font-size: clamp(58px, 9vw, 118px);
          line-height: 0.95;
          font-weight: 900;
          max-width: 950px;
          animation: fadeUp 1s ease forwards;
        }

        .hero-title .gold {
          display: block;
          font-style: italic;
          background: linear-gradient(135deg, #b8892e, #f0c97a, #e8724a);
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero-title .outline {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px rgba(237,232,220,0.22);
        }

        .hero-text {
          max-width: 680px;
          margin-top: 28px;
          color: rgba(237,232,220,0.55);
          font-size: 18px;
          line-height: 1.8;
          animation: fadeUp 1.1s ease forwards;
        }

        .hero-text strong {
          color: rgba(237,232,220,0.9);
        }

        .hero-actions {
          margin-top: 42px;
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 1.2s ease forwards;
        }

        .gold-btn {
          padding: 17px 38px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-weight: 800;
          color: #0a0e10;
          background: linear-gradient(135deg, #b8892e, #d4a853, #f0c97a);
          box-shadow: 0 18px 50px rgba(212,168,83,0.25);
          transition: 0.25s;
        }

        .gold-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 25px 70px rgba(212,168,83,0.38);
        }

        .ghost-btn {
          padding: 17px 34px;
          border-radius: 16px;
          border: 1px solid rgba(237,232,220,0.14);
          background: rgba(237,232,220,0.04);
          color: rgba(237,232,220,0.65);
          cursor: pointer;
          transition: 0.25s;
        }

        .ghost-btn:hover {
          color: white;
          border-color: rgba(237,232,220,0.3);
        }

        .stats {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(237,232,220,0.08);
          background: rgba(10,14,16,0.55);
        }

        .stat {
          padding: 28px;
          border-right: 1px solid rgba(237,232,220,0.08);
        }

        .stat h3 {
          font-size: 38px;
          color: #ede8dc;
          font-family: Georgia, serif;
        }

        .stat p {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(237,232,220,0.35);
        }

        .progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 100%;
          z-index: 100;
          background: linear-gradient(90deg, #1db489, #d4a853, #e8724a);
          animation: loadBar 3s linear forwards;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes loadBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .splash-nav {
            padding: 22px;
          }

          .brand-title {
            font-size: 18px;
          }

          .signin-btn {
            padding: 10px 18px;
          }

          .hero-title {
            font-size: 58px;
          }

          .hero-text {
            font-size: 15px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="splash-root">
        <canvas ref={canvasRef} className="splash-canvas" />

        <div className="splash-noise" />
        <div className="progress" />

        <nav className="splash-nav">
          <div className="brand-box">
            <div className="brand-icon">🛡️</div>
            <div>
              <div className="brand-title">
                TaxWise <span>Vault</span>
              </div>
              <div className="brand-sub">AI-Powered Tax Platform</div>
            </div>
          </div>

          <button className="signin-btn" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </nav>

        <div className="ticker">
          <div className="ticker-track">
            <div className="ticker-item">80C - ELSS · PPF · LIC · NSC · FD</div>
            <div className="ticker-item">80D - Health Insurance ₹25,000</div>
            <div className="ticker-item">NPS - Extra ₹50,000 deduction</div>
            <div className="ticker-item">HRA - 50% Basic Metro</div>
            <div className="ticker-item">Regime - Old vs New AI decides</div>

            <div className="ticker-item">80C - ELSS · PPF · LIC · NSC · FD</div>
            <div className="ticker-item">80D - Health Insurance ₹25,000</div>
            <div className="ticker-item">NPS - Extra ₹50,000 deduction</div>
            <div className="ticker-item">HRA - 50% Basic Metro</div>
            <div className="ticker-item">Regime - Old vs New AI decides</div>
          </div>
        </div>

        <section className="hero">
          <div className="badge">India&apos;s Smartest Tax Saving Platform · AI + ML</div>

          <h1 className="hero-title">
            Your Tax Bill
            <span className="gold">Reduced.</span>
            <span className="outline">Not a Guess.</span>
          </h1>

          <p className="hero-text">
            Stop overpaying tax. TaxWise Vault&apos;s{" "}
            <strong>ML-powered engine</strong> reads your salary slip, detects
            every deduction you&apos;re missing, and builds a{" "}
            <strong>legally optimized plan</strong>.
          </p>

          <div className="hero-actions">
            <button className="gold-btn" onClick={() => navigate("/signup")}>
              Analyze My Salary
            </button>

            <button className="ghost-btn" onClick={() => navigate("/login")}>
              Already a member
            </button>
          </div>
        </section>

        <div className="stats">
          <div className="stat">
            <h3>₹1.5L</h3>
            <p>Max 80C deduction</p>
          </div>

          <div className="stat">
            <h3>₹46K+</h3>
            <p>Avg tax saved</p>
          </div>

          <div className="stat">
            <h3>94%</h3>
            <p>ML suggestion accuracy</p>
          </div>

          <div className="stat">
            <h3>2</h3>
            <p>Tax regimes compared</p>
          </div>
        </div>
      </div>
    </>
  );
}