/**
 * Cookie Consent Banner — The Body Barn (Premium Edition)
 * Elegant centered card with brand typography, botanical accent & smooth animations.
 */
(function () {
    const STORAGE_KEY = 'tbb_cookie_consent';
    if (localStorage.getItem(STORAGE_KEY)) return;

    // ── Styles ─────────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tbb-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        @keyframes tbb-card-in {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0);    }
        }

        @keyframes tbb-card-out {
            from { opacity: 1; transform: translateY(0);    }
            to   { opacity: 0; transform: translateY(20px); }
        }

        #tbb-cookie-overlay {
            position: fixed;
            inset: 0;
            z-index: 9990;
            background: rgba(46, 31, 31, 0.45);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            animation: tbb-fade-in 0.4s ease forwards;
        }

        #tbb-cookie-overlay.hiding {
            animation: tbb-fade-in 0.35s ease reverse forwards;
        }

        #tbb-cookie-card {
            position: fixed;
            z-index: 9999;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            background: #faf8f5;
            box-shadow: 0 -8px 32px rgba(46,31,31,0.15);
            animation: tbb-card-in 0.50s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
            font-family: 'Montserrat', sans-serif;
            border-radius: 16px 16px 0 0;
            overflow: hidden;
        }

        #tbb-cookie-card.hiding {
            animation: tbb-card-out 0.30s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        /* Decorative top strip */
        #tbb-cookie-card::before {
            content: '';
            display: block;
            height: 3px;
            background: linear-gradient(90deg, #7a9470 0%, #b5c9a9 50%, #7a9470 100%);
            position: absolute;
            top: 0; left: 0; right: 0;
        }

        #tbb-cookie-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem 2rem;
            gap: 2rem;
        }

        #tbb-cookie-body {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            flex: 1;
        }

        #tbb-cookie-body .tbb-leaf {
            font-size: 2rem;
            line-height: 1;
        }

        #tbb-cookie-text h3 {
            font-family: 'Cormorant Garamond', 'Georgia', serif;
            font-size: 1.4rem;
            font-weight: 600;
            color: #2e1f1f;
            margin: 0 0 0.3rem;
            line-height: 1.2;
        }

        #tbb-cookie-text p {
            font-size: 0.8rem;
            line-height: 1.6;
            color: rgba(46,31,31,0.7);
            margin: 0;
            max-width: 500px;
        }

        /* Actions */
        #tbb-cookie-actions {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            flex-shrink: 0;
        }

        #tbb-cookie-decline, #tbb-cookie-accept {
            padding: 0.7rem 1.25rem;
            border-radius: 8px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
        }

        #tbb-cookie-decline {
            background: transparent;
            color: #2e1f1f;
            border: 1.5px solid rgba(46,31,31,0.2);
        }

        #tbb-cookie-decline:hover {
            border-color: rgba(46,31,31,0.5);
            background: rgba(46,31,31,0.04);
        }

        #tbb-cookie-accept {
            background: #2e1f1f;
            color: #f2ede8;
            border: none;
            position: relative;
            overflow: hidden;
        }

        #tbb-cookie-accept::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
            pointer-events: none;
        }

        #tbb-cookie-accept:hover {
            background: #3d2929;
            transform: translateY(-1px);
        }

        #tbb-cookie-close {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: rgba(46,31,31,0.05);
            color: rgba(46,31,31,0.5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        #tbb-cookie-close:hover {
            background: rgba(46,31,31,0.1);
            color: #2e1f1f;
        }

        @media (max-width: 768px) {
            #tbb-cookie-content {
                flex-direction: column;
                align-items: stretch;
                padding: 1.5rem 1.5rem 1.25rem;
                gap: 1.25rem;
            }
            #tbb-cookie-body {
                flex-direction: column;
                text-align: center;
                gap: 0.75rem;
            }
            #tbb-cookie-text p {
                max-width: 100%;
            }
            #tbb-cookie-actions {
                flex-direction: column;
                width: 100%;
            }
            #tbb-cookie-accept, #tbb-cookie-decline {
                width: 100%;
            }
            #tbb-cookie-accept { order: -1; }
        }
    \`;
    document.head.appendChild(style);

    // ── HTML ───────────────────────────────────────────────────────────────────
    // Overlay (subtle backdrop)
    const overlay = document.createElement('div');
    overlay.id = 'tbb-cookie-overlay';

    // Card
    const card = document.createElement('div');
    card.id = 'tbb-cookie-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'Cookie preferences');
    card.innerHTML = \`
        <button id="tbb-cookie-close" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M2 2l10 10M12 2L2 12"/>
            </svg>
        </button>
        <div id="tbb-cookie-content">
            <div id="tbb-cookie-body">
                <span class="tbb-leaf" aria-hidden="true">🌿</span>
                <div id="tbb-cookie-text">
                    <h3>A Mindful Note on Cookies</h3>
                    <p>We use a small number of cookies to remember your preferences and improve your experience. We respect your privacy and never share your data.</p>
                </div>
            </div>
            <div id="tbb-cookie-actions">
                <button id="tbb-cookie-decline">Decline</button>
                <button id="tbb-cookie-accept">Accept &amp; Continue</button>
            </div>
        </div>
    \`;

    document.body.appendChild(overlay);
    document.body.appendChild(card);

    // ── Dismiss Logic ──────────────────────────────────────────────────────────
    function dismiss(choice) {
        localStorage.setItem(STORAGE_KEY, choice);

        card.classList.add('hiding');
        overlay.classList.add('hiding');

        const cleanup = () => {
            card.remove();
            overlay.remove();
        };

        card.addEventListener('animationend', cleanup, { once: true });
    }

    document.getElementById('tbb-cookie-accept').addEventListener('click', () => dismiss('accepted'));
    document.getElementById('tbb-cookie-decline').addEventListener('click', () => dismiss('declined'));
    document.getElementById('tbb-cookie-close').addEventListener('click',   () => dismiss('declined'));

    // Clicking the overlay also dismisses
    overlay.addEventListener('click', () => dismiss('declined'));
})();
