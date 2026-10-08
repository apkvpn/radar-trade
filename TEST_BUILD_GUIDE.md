/**
 * COMPREHENSIVE TEST & BUILD GUIDE
 * RadarTrade - Signal Generation Update
 * 
 * Date: 2026-10-08
 * Version: 1.0
 * 
 * ============================================================================
 * UPDATED SIGNAL LOGIC
 * ============================================================================
 * 
 * PREVIOUS BEHAVIOR:
 * - Signal: Price ENTERS the green support zone (price < support)
 * - Problem: False signals on 15m timeframe, inconsistent across TFs
 * 
 * NEW BEHAVIOR (IMPLEMENTED):
 * ✅ Signal: Price BREAKS OUT FROM green zone UPWARD
 *    Conditions:
 *    1. Previous candle was IN the green zone (p.l <= ps)
 *    2. Current candle BREAKS OUT ABOVE (c.c > s OR c.h > s)
 *    3. Signal fires on candle close ONLY (c.x = true)
 *    4. Applies UNIFORMLY across ALL timeframes (1m, 5m, 15m, 1h, 4h, 1d)
 * 
 * TARGET: Resistance (gray line/midline + envelope)
 *   - Auto-target when price touches resistance level
 * 
 * STOPLOSS: Unchanged from previous configuration
 *   - Uses configured percentages/amounts (no changes)
 * 
 * ============================================================================
 * FILE CHANGES SUMMARY
 * ============================================================================
 * 
 * FILE: src/server/engine.ts
 * ────────────────────────────────────────────────────────────────────────────
 * MODIFIED FUNCTION: analyze()
 * 
 * OLD LOGIC (lines 154-156):
 *   const touches = c.l <= s;
 *   const prevTouched = p.l <= ps;
 *   if (touches && !prevTouched) { ... } // Entry into zone
 * 
 * NEW LOGIC (lines 150-156):
 *   const prevTouched = p.l <= ps;
 *   const breakoutUp = c.c > s || c.h > s;
 *   if (prevTouched && breakoutUp) { ... } // Breakout from zone
 * 
 * CHANGES APPLIED:
 * ✓ Updated signal detection from "entry" to "breakout"
 * ✓ Enhanced documentation with new strategy explanation
 * ✓ Condition logic: Entry → Exit/Breakout
 * 
 * ============================================================================
 * TESTING CHECKLIST
 * ============================================================================
 * 
 * 1. TIMEFRAME VALIDATION (All TFs)
 *    □ 1m:  Run 1-2 hours, verify signal timing
 *    □ 5m:  Run 4-6 hours, check consistency
 *    □ 15m: Run 12+ hours (fix for this TF), monitor carefully
 *    □ 1h:  Run 24+ hours, validate
 *    □ 4h:  Run 48+ hours (optional), general check
 *    □ 1d:  Run 7+ days (optional), high-level review
 * 
 * 2. SIGNAL QUALITY CHECKS
 *    □ No duplicate signals for same symbol/TF
 *    □ Signal price > support level (confirms breakout)
 *    □ Signals distributed across different symbols
 *    □ No false positives (whipsaws)
 *    □ Resistance value is logically > midline
 * 
 * 3. DATABASE VALIDATION (NEON PostgreSQL)
 *    □ Signals table has new entries
 *    □ All signal fields populated correctly
 *    □ Timestamps are accurate
 *    □ No duplicate IDs in DB
 * 
 * 4. UI/UX VERIFICATION
 *    □ Signals appear on chart markers
 *    □ Green zone (support) renders correctly
 *    □ Gray zone (resistance) renders correctly
 *    □ Price breakout marked visually on chart
 *    □ Signal strip shows latest signals
 * 
 * 5. NOTIFICATIONS (Push/Sound/Desktop)
 *    □ Sound alert triggers on signal
 *    □ Desktop notification shows correct symbol/TF/price
 *    □ No duplicate notifications
 *    □ Works on all TFs uniformly
 * 
 * ============================================================================
 * DEPLOYMENT WORKFLOW
 * ============================================================================
 * 
 * STEP 1: LOCAL TESTING
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Clone the repo:
 *    git clone https://github.com/apkvpn/radar-trade.git
 *    cd radar-trade
 * 
 * 2. Install dependencies:
 *    npm install
 * 
 * 3. Configure environment:
 *    cp .env.example .env.local
 *    
 *    REQUIRED VARIABLES:
 *    DATABASE_URL=postgresql://neondb_owner:npg_rAx5pKEfsj1m@ep-little-dream-b4nzjdo5-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
 *    VAPID_PUBLIC_KEY=<your-push-key>
 *    VAPID_PRIVATE_KEY=<your-private-key>
 *    NODE_ENV=development
 * 
 * 4. Run development server:
 *    npm run dev
 *    Opens: http://localhost:3000
 * 
 * 5. Test the application:
 *    - Select different markets and timeframes
 *    - Monitor signal generation in real-time
 *    - Watch browser console for errors
 *    - Check server logs for signal processing
 * 
 * STEP 2: PREVIEW DEPLOYMENT (Manus Space)
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Build production version:
 *    npm run build
 * 
 * 2. Deploy to Manus Space:
 *    Environment: https://radartrade-ulmw6w4n.manus.space
 *    
 *    Commands (via Manus dashboard or CLI):
 *    npm install
 *    npm run build
 *    npm start
 * 
 * 3. Verify preview is live:
 *    curl https://radartrade-ulmw6w4n.manus.space
 *    (Should return HTML with "SHahab Radar" title)
 * 
 * 4. Test on preview:
 *    - Open in browser: https://radartrade-ulmw6w4n.manus.space
 *    - Run through testing checklist above
 *    - Monitor for errors in browser console
 *    - Check database (NEON) for new signal entries
 * 
 * STEP 3: PRODUCTION DEPLOYMENT (Main Domain)
 * ─────────────────────────────────────────────────────────────────────────
 * AFTER preview testing is complete and APPROVED:
 * 
 * 1. Update DNS/CNAME for main domain
 *    (Keep radartrade-ulmw6w4n.manus.space pointing to production)
 * 
 * 2. Deploy to production:
 *    Same build process, different environment
 * 
 * 3. Smoke test on main domain:
 *    - Load main domain
 *    - Verify live signal feed
 *    - Confirm database connectivity
 * 
 * ============================================================================
 * MONITORING & TROUBLESHOOTING
 * ============================================================================
 * 
 * COMMON ISSUES & FIXES
 * 
 * Issue 1: No signals appearing
 * ─────────────────────────────
 * Causes:
 *  - Market data not syncing (check Binance API)
 *  - Universe (Top 50) not loaded
 *  - Scanner not running
 * 
 * Fix:
 *  1. Check server logs for errors
 *  2. Verify NEON database connection
 *  3. Restart scanner cycle: POST /api/scan
 *  4. Check if markets have sufficient historical data
 * 
 * Issue 2: Signals on 15m delayed or missing
 * ─────────────────────────────────────────
 * Causes:
 *  - Websocket lag on 15m klines
 *  - Grace period timeout
 *  - Candle not yet closed
 * 
 * Fix:
 *  1. Monitor scanner.ts GRACE_MS (currently 2500ms)
 *  2. Check if Binance 15m stream is connected
 *  3. Verify candle closure detection (c.x flag)
 *  4. Look for "gap or missed close event" logs
 * 
 * Issue 3: Duplicate signals for same market
 * ───────────────────────────────────────────
 * Causes:
 *  - evaluateCombo() called multiple times per candle
 *  - Database duplicate not caught
 *  - Signal ID collision
 * 
 * Fix:
 *  1. Check if evaluatedThrough counter is advancing
 *  2. Verify database unique constraint on signal ID
 *  3. Ensure insertSignal() handles duplicates correctly
 * 
 * ============================================================================
 * KEY CODE LOCATIONS
 * ============================================================================
 * 
 * Signal Generation:
 *   📄 src/server/engine.ts (analyze function)
 *      - Lines 143-161: Signal detection logic
 * 
 * Signal Evaluation Loop:
 *   📄 src/server/scanner.ts
 *      - Lines 249-296: evaluateCombo() function
 *      - Lines 361-396: scanCycle() main loop
 *      - Lines 71-83: hydrateLastSignals()
 * 
 * Database Persistence:
 *   📄 src/server/repo.ts
 *      - insertSignal() function
 *      - lastSignalPerCombo() query
 * 
 * UI Display (Chart):
 *   📄 src/components/ChartPanel.tsx
 *      - Signal markers rendering
 *      - Zone drawing on chart
 * 
 * UI Display (Signal Strip):
 *   📄 src/components/SignalStrip.tsx
 *      - Latest signals display
 * 
 * Notifications:
 *   📄 src/server/notify.ts
 *      - dispatchSignal() function
 *      - Push/Email/Telegram routing
 * 
 * ============================================================================
 * PERFORMANCE METRICS
 * ============================================================================
 * 
 * EXPECTED PERFORMANCE (with 50 markets × 6 TFs = 300 combos):
 * 
 * Scan Cycle Time:    2-5 seconds per 5-second interval
 * Database Queries:   ~1-10 per cycle (async)
 * Memory Usage:       ~200-400MB (candle cache: 700 per combo)
 * Websocket Latency:  <500ms for kline updates
 * Signal Detection:   <100ms per candle close
 * 
 * NEON Database:
 *   - Connection pool: 5-10 connections
 *   - Query timeout: 30 seconds
 *   - Max concurrent: 20 queries
 * 
 * ============================================================================
 * ROLLBACK PLAN
 * ============================================================================
 * 
 * If issues occur, revert to previous commit:
 * 
 * 1. Identify broken commit:
 *    git log --oneline | head -5
 * 
 * 2. Get previous commit SHA:
 *    git log --oneline | grep "Update signal"
 *    Example: 784c19e
 * 
 * 3. Revert changes:
 *    git revert d53975f99b0a8f20ddb7b31be1963d6feecae544
 *    git push
 * 
 * 4. Or rollback entire commit:
 *    git reset --hard 784c19e
 *    git push --force-with-lease
 * 
 * 5. Redeploy from last known good version
 * 
 * ============================================================================
 * SUCCESS CRITERIA
 * ============================================================================
 * 
 * ✓ All 6 timeframes (1m, 5m, 15m, 1h, 4h, 1d) generate signals uniformly
 * ✓ No false positives on 15m (original issue resolved)
 * ✓ Signal price > support level (confirms breakout)
 * ✓ Resistance auto-target triggers when touched
 * ✓ Stoploss configuration unchanged and functional
 * ✓ Database stores all signals with correct timestamps
 * ✓ UI displays signals with chart markers
 * ✓ Notifications (push/sound/desktop) work correctly
 * ✓ No performance degradation vs. previous version
 * ✓ Zero duplicate signals in database
 * 
 * ============================================================================
 * FINAL CHECKLIST BEFORE GOING LIVE
 * ============================================================================
 * 
 * PRE-PRODUCTION:
 * ☐ Code review passed (logic change reviewed)
 * ☐ Unit tests pass (if applicable)
 * ☐ Integration tests pass
 * ☐ All 6 timeframes tested and working
 * ☐ Database backups taken
 * ☐ Preview deployment tested (24+ hours running)
 * ☐ Signal quality acceptable (no spam, no false signals)
 * ☐ Notifications working on preview
 * ☐ Rollback procedure documented and tested
 * 
 * PRODUCTION DEPLOYMENT:
 * ☐ Scheduled deployment window identified
 * ☐ Team notified of changes
 * ☐ Monitoring alerts configured
 * ☐ Database migration (if any) verified
 * ☐ Environment variables checked
 * ☐ SSL certificates valid
 * ☐ DNS records correct
 * ☐ Incident response team on standby
 * ☐ Post-deployment monitoring plan ready
 * 
 * ============================================================================
 * CONTACTS & SUPPORT
 * ============================================================================
 * 
 * Repository: https://github.com/apkvpn/radar-trade
 * Database:   NEON PostgreSQL (ep-little-dream-b4nzjdo5)
 * Preview:    https://radartrade-ulmw6w4n.manus.space
 * Status:     CHECK GitHub Actions workflow
 * 
 * Issues:     GitHub Issues → /apkvpn/radar-trade/issues
 * PR Review:  GitHub Pull Requests → /apkvpn/radar-trade/pulls
 * 
 * ============================================================================
 * END OF COMPREHENSIVE TEST & BUILD GUIDE
 * ============================================================================
