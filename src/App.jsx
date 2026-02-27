

  // Show LTC education screen before module E (index 4)
  if (showLTCScreen) {
    return <LTCEducationScreen lang={lang} onContinue={() => { setShowLTCScreen(false); setCurrentModule(4); topRef.current?.scrollIntoView({ behavior: "smooth" }); }} />;
  }

  const t = T[lang];
  const MODULES = t.modules;
  const module = MODULES[currentModule];

  const handleAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
  const isModuleComplete = () => module.questions.every(q => answers[q.id] && String(answers[q.id]).trim() !== "");

  const next = () => {
    // Before moving to Module E (index 4 = Protection), show LTC education screen
    if (currentModule === 3) {
      setShowLTCScreen(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (currentModule < MODULES.length - 1) {
      setAnimating(true);
      setTimeout(() => { setCurrentModule(p => p + 1); setAnimating(false); topRef.current?.scrollIntoView({ behavior: "smooth" }); }, 260);
    } else {
      window._fa_answers = answers;
      const generated = generatePlan(answers, lang);
      window._fa_plan = generated;
      setPlan(generated);
      setShowPlan(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const back = () => {
    if (showPlan) { setShowPlan(false); return; }
    if (currentModule > 0) { setCurrentModule(p => p - 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); }
  };
  const reset = () => { setAnswers({}); setCurrentModule(0); setShowPlan(false); setShowThanks(false); setShowLTCScreen(false); setPlan(null); setLang(null); setSeenIntro(false); };
  const progress = showPlan ? 100 : (currentModule / MODULES.length) * 100;

  const disclaimerText = lang === "en"
    ? `Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero. ${advisorName ? `Presentado por ${advisorName}.` : ""} We will contact you to present personalized options and strategies.`
    : `Con fines educativos únicamente. No constituye asesoramiento legal, fiscal ni financiero. ${advisorName ? `Presentado por ${advisorName}.` : ""} Nos pondremos en contacto para presentarte opciones y estrategias personalizadas.`;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #07090f 0%, #0b1120 50%, #080e1a 100%)", fontFamily: "'DM Sans', sans-serif", color: "#e8dcc8", position: "relative", overflow: "hidden" }}>
      <GlobalStyles />

      {/* Ambient background orbs */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,160,80,0.04) 0%, transparent 70%)", top: "-100px", right: "-150px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,144,217,0.04) 0%, transparent 70%)", bottom: "10%", left: "-100px", pointerEvents: "none", zIndex: 0 }} />

      {/* ── HEADER ── */}
      <div ref={topRef} style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(200,160,80,0.15)", padding: "0 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #c8a050, #e8c878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 16px rgba(200,160,80,0.35)", flexShrink: 0 }}>⚖️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8c878", fontFamily: "'Playfair Display', serif", letterSpacing: 0.5 }}>{t.appTitle}</div>
              {clientName
                ? <div style={{ fontSize: 10, color: "#c8a05099", fontWeight: 500 }}>👤 {clientName}</div>
                : <div style={{ fontSize: 9, color: "#445566", letterSpacing: 2, textTransform: "uppercase" }}>{t.appSubtitle}</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!showPlan && (
              <div style={{ fontSize: 11, color: "#445566" }}>
                <span style={{ color: "#c8a050", fontWeight: 600, fontFamily: "'Playfair Display', serif", fontSize: 13 }}>{currentModule + 1}</span>
                <span style={{ color: "#334455", margin: "0 3px" }}>/</span>
                <span>{MODULES.length}</span>
              </div>
            )}
            <button onClick={reset} className="btn-ghost" style={{ padding: "5px 12px", fontSize: 10, letterSpacing: 0.5 }}>{t.switchLang}</button>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,0.04)", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #c8a050, #e8c878, #c8a050)", backgroundSize: "200% 100%", transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 8px rgba(200,160,80,0.6)", animation: "shimmer 2s linear infinite" }} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 18px 60px", position: "relative", zIndex: 1 }}>
        {!showPlan ? (
          <div key={currentModule} className="anim-fadeup" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.22s ease" }}>

            {/* Module header */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              {/* Step dots */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 20 }}>
                {MODULES.map((m, i) => (
                  <div key={m.id} style={{
                    height: 4, borderRadius: 3,
                    width: i === currentModule ? 28 : (i < currentModule ? 14 : 8),
                    background: i < currentModule ? "rgba(200,160,80,0.6)" : i === currentModule ? "#e8c878" : "rgba(255,255,255,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: i === currentModule ? "0 0 8px rgba(232,200,120,0.7)" : "none"
                  }} />
                ))}
              </div>

              <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, rgba(200,160,80,0.15), rgba(200,160,80,0.06))", border: "1px solid rgba(200,160,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px", boxShadow: "0 4px 20px rgba(200,160,80,0.12)" }}>{module.icon}</div>

              <div style={{ fontSize: 10, color: "#c8a050", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{t.moduleLabel} {module.id}</div>
              <h2 className="fa-header" style={{ fontSize: 22, fontWeight: 700, color: "#f0e4c8", margin: "0 0 8px", letterSpacing: 0.3, lineHeight: 1.2 }}>{module.title}</h2>
              <p style={{ color: "#445566", fontSize: 11, margin: 0, fontStyle: "italic" }}>{t.answerHonestly}</p>
            </div>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {module.questions.map((q, qi) => (
                <div key={q.id} className="anim-fadeup" style={{
                  animationDelay: `${qi * 0.07}s`,
                  background: answers[q.id] ? "rgba(200,160,80,0.05)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${answers[q.id] ? "rgba(200,160,80,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 14, padding: "16px 18px",
                  transition: "border-color 0.25s, background 0.25s",
                  boxShadow: answers[q.id] ? "0 2px 16px rgba(200,160,80,0.07)" : "none"
                }}>
                  <label style={{ display: "block", fontSize: 12, color: "#9ab0c4", marginBottom: 10, fontWeight: 500, lineHeight: 1.5 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: "rgba(200,160,80,0.12)", border: "1px solid rgba(200,160,80,0.25)", color: "#c8a050", fontSize: 9, fontWeight: 700, marginRight: 8, flexShrink: 0, verticalAlign: "middle" }}>{qi + 1}</span>
                    {q.label}
                  </label>
                  {q.type === "select" ? (
                    <select value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value)} className="fa-select">
                      <option value="">{t.selectPlaceholder}</option>
                      {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={q.type} placeholder={q.placeholder} value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value)} className="fa-input" />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "space-between", alignItems: "center" }}>
              {currentModule > 0
                ? <button onClick={back} className="btn-ghost">{t.backBtn}</button>
                : <div />}
              <button onClick={next} disabled={!isModuleComplete()} className="btn-primary" style={{ opacity: isModuleComplete() ? 1 : 0.35 }}>
                {currentModule === MODULES.length - 1 ? t.generateBtn : t.nextBtn}
              </button>
            </div>

            {/* Completion hint */}
            {!isModuleComplete() && (
              <p style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: "#334455", fontStyle: "italic" }}>
                {lang === "en" ? "Answer all questions above to continue" : "Responde todas las preguntas para continuar"}
              </p>
            )}
          </div>
        ) : (
          <PlanDisplay plan={plan} lang={lang} clientName={clientName} advisorName={advisorName} onBack={back} onReset={reset} onFinish={() => {
            // Send email via EmailJS
            sendReport({ answers, plan, clientName, clientEmail, clientPhone, advisorName, lang });
            setShowThanks(true);
          }} />
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "14px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 9, color: "#2a3340", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 6px" }}>{disclaimerText}</div>
        <a href="?mode=advisor" style={{ fontSize: 9, color: "#2a3340", textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>Advisor Portal</a>
      </div>
    </div>
  );
}
