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
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        @keyframes tbb-card-out {
            from { opacity: 1; transform: translateY(0)   scale(1);    }
            to   { opacity: 0; transform: translateY(12px) scale(0.97); }
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
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            width: min(92vw, 520px);
            background: #faf8f5;
            border-radius: 16px;
            box-shadow:
                0 0 0 1px rgba(46,31,31,0.08),
                0 8px 32px rgba(46,31,31,0.18),
                0 2px 8px rgba(46,31,31,0.10);
            overflow: hidden;
            animation: tbb-card-in 0.50s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
            font-family: 'Montserrat', sans-serif;
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
        }

        #tbb-cookie-body {
            padding: 1.75rem 2rem 0;
            text-align: center;
        }

        #tbb-cookie-body .tbb-leaf {
            display: block;
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
            line-height: 1;
        }

        #tbb-cookie-body h3 {
            font-family: 'Cormorant Garamond', 'Georgia', serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: #2e1f1f;
            letter-spacing: 0.04em;
            margin: 0 0 0.6rem;
            line-height: 1.2;
        }

        #tbb-cookie-body p {
            font-size: 0.78rem;
            line-height: 1.65;
            color: #2e1f1f;
            opacity: 0.65;
            margin: 0;
            max-width: 360px;
            margin-inline: auto;
        }

        #tbb-cookie-body p a {
            color: #7a9470;
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: color 0.2s;
        }

        #tbb-cookie-body p a:hover {
            color: #4d6a44;
        }

        /* Divider */
        #tbb-cookie-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(46,31,31,0.1), transparent);
            margin: 1.5rem 2rem 0;
        }

        /* Actions */
        #tbb-cookie-actions {
            display: flex;
            gap: 0.75rem;
            padding: 1.25rem 2rem 1.75rem;
        }

        #tbb-cookie-decline {
            flex: 1;
            background: transparent;
            color: #2e1f1f;
            border: 1.5px solid rgba(46,31,31,0.2);
            padding: 0.7rem 1rem;
            border-radius: 8px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s, color 0.2s;
        }

        #tbb-cookie-decline:hover {
            border-color: rgba(46,31,31,0.5);
            background: rgba(46,31,31,0.04);
        }

        #tbb-cookie-accept {
            flex: 2;
            background: #2e1f1f;
            color: #f2ede8;
            border: none;
            padding: 0.7rem 1.5rem;
            border-radius: 8px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: background 0.25s, transform 0.15s;
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

        #tbb-cookie-accept:active {
            transform: translateY(0);
        }

        /* Close button */
        #tbb-cookie-close {
            position: absolute;
            top: 0.85rem;
            right: 0.85rem;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: rgba(46,31,31,0.35);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, color 0.2s;
            padding: 0;
            font-size: 0;
        }

        #tbb-cookie-close:hover {
            background: rgba(46,31,31,0.07);
            color: rgba(46,31,31,0.7);
        }

        @media (max-width: 480px) {
            #tbb-cookie-card {
                bottom: 1rem;
                border-radius: 14px;
            }

            #tbb-cookie-body {
                padding: 1.5rem 1.5rem 0;
            }

            #tbb-cookie-divider {
                margin: 1.25rem 1.5rem 0;
            }

            #tbb-cookie-actions {
                flex-direction: column;
                padding: 1rem 1.5rem 1.5rem;
                gap: 0.6rem;
            }

            #tbb-cookie-accept,
            #tbb-cookie-decline {
                flex: none;
                width: 100%;
            }

            #tbb-cookie-accept {
                order: -1;
            }
        }
    `;
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
    card.innerHTML = `
        <button id="tbb-cookie-close" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M2 2l10 10M12 2L2 12"/>
            </svg>
        </button>
        <div id="tbb-cookie-body">
            <span class="tbb-leaf" aria-hidden="true">🌿</span>
            <h3>A Mindful Note on Cookies</h3>
            <p>We use a small number of cookies to remember your preferences and improve your experience. We respect your privacy and never share your data.</p>
        </div>
        <div id="tbb-cookie-divider"></div>
        <div id="tbb-cookie-actions">
            <button id="tbb-cookie-decline">Decline</button>
            <button id="tbb-cookie-accept">Accept &amp; Continue</button>
        </div>
    `;

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
