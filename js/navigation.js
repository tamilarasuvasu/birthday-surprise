(function () {
  const steps = Array.from(document.querySelectorAll('.step'));
  let currentStep = 1;
  let transitionTimer = 0;

  function updateChapter(stepNumber) {
    const step = document.getElementById('step' + stepNumber);
    const chapter = document.getElementById('chapter');
    if (step && chapter) chapter.textContent = step.dataset.chapter || '';
  }

  function hideAllSteps() {
    window.clearTimeout(transitionTimer);
    steps.forEach(function (step) {
      step.classList.remove('active', 'is-leaving');
      step.hidden = true;
      step.setAttribute('aria-hidden', 'true');
    });
  }

  function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > steps.length || stepNumber === currentStep) return;
    const current = document.getElementById('step' + currentStep);
    const next = document.getElementById('step' + stepNumber);
    if (!next) return;
    window.clearTimeout(transitionTimer);
    if (current && !current.hidden) {
      current.classList.add('is-leaving');
      current.setAttribute('aria-hidden', 'true');
    }
    currentStep = stepNumber;
    updateChapter(stepNumber);
    window.setTimeout(function () {
      if (current) {
        current.hidden = true;
        current.classList.remove('active', 'is-leaving');
      }
      next.hidden = false;
      next.setAttribute('aria-hidden', 'false');
      next.classList.add('active');
      if (stepNumber === 5) document.body.classList.add('is-final');
      else document.body.classList.remove('is-final');
    }, current ? 360 : 0);
  }

  function nextStep() { showStep(currentStep + 1); }
  function previousStep() { showStep(currentStep - 1); }

  window.BirthdayNavigation = { showStep, nextStep, previousStep, hideAllSteps, getCurrentStep: function () { return currentStep; } };
})();
