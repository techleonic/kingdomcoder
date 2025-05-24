// Kingdom Coder JavaScript Functions
/*
// Global variables
let currentUser = null
const assessmentData = {
  currentQuestion: 0,
  answers: [],
  questions: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language",
      ],
      correct: 0,
      category: "computing",
    },
    {
      question: "Choose the correct translation: 'I am learning programming'",
      options: [
        "Estoy aprendiendo programación",
        "Yo aprendo programación",
        "Voy a aprender programación",
        "He aprendido programación",
      ],
      correct: 0,
      category: "english",
    },
    {
      question: "Which of the following is a programming language?",
      options: ["Photoshop", "Microsoft Word", "JavaScript", "Windows"],
      correct: 2,
      category: "computing",
    },
    {
      question: "Complete the sentence: 'She _____ to work every day'",
      options: ["go", "goes", "going", "gone"],
      correct: 1,
      category: "english",
    },
    {
      question: "What is CSS used for?",
      options: ["Database management", "Styling web pages", "Server programming", "File compression"],
      correct: 1,
      category: "computing",
    },
  ],
}

// Bootstrap library
const bootstrap = {
  Modal: {
    getInstance: (element) => ({
      hide: () => {
        element.style.display = "none"
      },
    }),
  },
  Collapse: {
    getInstance: (element) => ({
      hide: () => {
        element.classList.remove("show")
      },
    }),
  },
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Check if user is logged in
  checkUserSession()

  // Initialize event listeners
  setupEventListeners()

  // Smooth scrolling for navigation links
  setupSmoothScrolling()
}

function setupEventListeners() {
  // Login form
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContact)
  }

  // Stage cards click events
  const stageCards = document.querySelectorAll(".stage-card")
  stageCards.forEach((card) => {
    card.addEventListener("click", function () {
      const stage = this.getAttribute("data-stage")
      handleStageClick(stage)
    })
  })
}

function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse")
        if (navbarCollapse.classList.contains("show")) {
          bootstrap.Collapse.getInstance(navbarCollapse).hide()
        }
      }
    })
  })
}

// Authentication functions
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<span class="loading"></span> Ingresando...'
  submitBtn.disabled = true

  // Simulate login process
  setTimeout(() => {
    if (email && password) {
      currentUser = {
        email: email,
        name: email.split("@")[0],
        stage: 0,
        completedStages: [],
      }

      localStorage.setItem("kingdomCoderUser", JSON.stringify(currentUser))

      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
      modal.hide()

      // Show success message
      showNotification("¡Bienvenido a Kingdom Coder!", "success")

      // Update UI
      updateUIForLoggedInUser()
    } else {
      showNotification("Por favor, completa todos los campos", "error")
    }

    // Restore button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }, 1500)
}

function checkUserSession() {
  const userData = localStorage.getItem("kingdomCoderUser")
  if (userData) {
    currentUser = JSON.parse(userData)
    updateUIForLoggedInUser()
  }
}

function updateUIForLoggedInUser() {
  // Update navigation
  const loginBtn = document.querySelector('[data-bs-target="#loginModal"]')
  if (loginBtn && currentUser) {
    loginBtn.innerHTML = `<i class="fas fa-user me-2"></i>${currentUser.name}`
    loginBtn.removeAttribute("data-bs-toggle")
    loginBtn.removeAttribute("data-bs-target")
    loginBtn.onclick = showUserDashboard
  }

  // Update stage access
  updateStageAccess()
}

function updateStageAccess() {
  if (!currentUser) return

  const stageCards = document.querySelectorAll(".stage-card")
  stageCards.forEach((card, index) => {
    const button = card.querySelector("button")
    if (index <= currentUser.stage || currentUser.completedStages.includes(index)) {
      button.disabled = false
      button.classList.remove("btn-outline-primary")
      button.classList.add("btn-primary")

      if (currentUser.completedStages.includes(index)) {
        button.innerHTML = '<i class="fas fa-check me-2"></i>Completado'
        button.classList.remove("btn-primary")
        button.classList.add("btn-success")
      }
    }
  })
}

// Assessment functions
function startAssessment() {
  const modal = new bootstrap.Modal(document.getElementById("assessmentModal"))
  modal.show()
}

function startQuiz() {
  assessmentData.currentQuestion = 0
  assessmentData.answers = []
  showQuestion()
}

function showQuestion() {
  const content = document.getElementById("assessmentContent")
  const question = assessmentData.questions[assessmentData.currentQuestion]

  content.innerHTML = `
        <div class="question-container">
            <div class="progress mb-4">
                <div class="progress-bar bg-primary" style="width: ${((assessmentData.currentQuestion + 1) / assessmentData.questions.length) * 100}%"></div>
            </div>
            
            <h4 class="mb-4">Pregunta ${assessmentData.currentQuestion + 1} de ${assessmentData.questions.length}</h4>
            
            <div class="question-card bg-light p-4 rounded mb-4">
                <h5>${question.question}</h5>
            </div>
            
            <div class="options">
                ${question.options
                  .map(
                    (option, index) => `
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="radio" name="answer" id="option${index}" value="${index}">
                        <label class="form-check-label" for="option${index}">
                            ${option}
                        </label>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div class="d-flex justify-content-between mt-4">
                <button class="btn btn-outline-secondary" onclick="previousQuestion()" ${assessmentData.currentQuestion === 0 ? "disabled" : ""}>
                    <i class="fas fa-arrow-left me-2"></i>Anterior
                </button>
                <button class="btn btn-primary" onclick="nextQuestion()">
                    ${assessmentData.currentQuestion === assessmentData.questions.length - 1 ? "Finalizar" : "Siguiente"}
                    <i class="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
    `
}

function nextQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked')

  if (!selectedAnswer) {
    showNotification("Por favor, selecciona una respuesta", "warning")
    return
  }

  assessmentData.answers.push(Number.parseInt(selectedAnswer.value))

  if (assessmentData.currentQuestion < assessmentData.questions.length - 1) {
    assessmentData.currentQuestion++
    showQuestion()
  } else {
    finishAssessment()
  }
}

function previousQuestion() {
  if (assessmentData.currentQuestion > 0) {
    assessmentData.currentQuestion--
    assessmentData.answers.pop()
    showQuestion()
  }
}

function finishAssessment() {
  const score = calculateScore()
  const recommendedStage = getRecommendedStage(score)

  // Update user data
  if (currentUser) {
    currentUser.stage = recommendedStage
    currentUser.assessmentScore = score
    localStorage.setItem("kingdomCoderUser", JSON.stringify(currentUser))
  }

  showAssessmentResults(score, recommendedStage)
}

function calculateScore() {
  let correct = 0
  assessmentData.questions.forEach((question, index) => {
    if (assessmentData.answers[index] === question.correct) {
      correct++
    }
  })
  return (correct / assessmentData.questions.length) * 100
}

function getRecommendedStage(score) {
  if (score >= 80) return 2 // Especialización
  if (score >= 60) return 1 // Preparación
  return 1 // Preparación (minimum)
}

function showAssessmentResults(score, stage) {
  const content = document.getElementById("assessmentContent")
  const stageNames = ["Test", "Preparación", "Especialización", "Reclutamiento"]

  content.innerHTML = `
        <div class="text-center">
            <div class="result-icon mb-4">
                <i class="fas fa-trophy text-accent" style="font-size: 4rem;"></i>
            </div>
            
            <h3 class="mb-3">¡Evaluación Completada!</h3>
            
            <div class="score-display mb-4">
                <div class="score-circle mx-auto mb-3">
                    <span class="score-text">${Math.round(score)}%</span>
                </div>
            </div>
            
            <div class="alert alert-info">
                <h5>Tu Stage Recomendado:</h5>
                <h4 class="text-primary">Stage ${stage}: ${stageNames[stage]}</h4>
            </div>
            
            <div class="recommendation mb-4">
                ${getStageRecommendation(stage)}
            </div>
            
            <button class="btn btn-accent btn-lg" onclick="enrollInStage(${stage})">
                <i class="fas fa-rocket me-2"></i>Comenzar Mi Entrenamiento
            </button>
        </div>
    `
}

function getStageRecommendation(stage) {
  const recommendations = {
    1: `
            <p><strong>Recomendación:</strong> Te sugerimos comenzar con nuestro programa de preparación. 
            Fortaleceremos tus bases en inglés técnico y conceptos fundamentales de computación.</p>
        `,
    2: `
            <p><strong>Recomendación:</strong> ¡Excelente! Puedes avanzar directamente a la especialización. 
            Elige tu área de interés: Programación, Community Management o Social Media.</p>
        `,
  }

  return recommendations[stage] || recommendations[1]
}

function enrollInStage(stage) {
  if (!currentUser) {
    showNotification("Por favor, inicia sesión para continuar", "warning")
    return
  }

  // Close assessment modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("assessmentModal"))
  modal.hide()

  // Show success and redirect
  showNotification(`¡Te has inscrito en el Stage ${stage}!`, "success")

  // Update UI
  updateUIForLoggedInUser()

  // Scroll to stages section
  setTimeout(() => {
    document.getElementById("stages").scrollIntoView({ behavior: "smooth" })
  }, 1000)
}

// Contact form handler
function handleContact(e) {
  e.preventDefault()

  const name = document.getElementById("contactName").value
  const email = document.getElementById("contactEmail").value
  const message = document.getElementById("message").value

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<span class="loading"></span> Enviando...'
  submitBtn.disabled = true

  // Simulate sending message
  setTimeout(() => {
    showNotification("¡Mensaje enviado correctamente! Te contactaremos pronto.", "success")

    // Reset form
    e.target.reset()

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("contactModal"))
    modal.hide()

    // Restore button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }, 2000)
}

// Stage interaction
function handleStageClick(stage) {
  if (!currentUser) {
    showNotification("Por favor, inicia sesión para acceder a los stages", "warning")
    return
  }

  const stageNum = Number.parseInt(stage)

  if (stageNum === 0) {
    startAssessment()
  } else if (stageNum <= currentUser.stage || currentUser.completedStages.includes(stageNum)) {
    showStageContent(stageNum)
  } else {
    showNotification("Debes completar los stages anteriores primero", "warning")
  }
}

function showStageContent(stage) {
  const stageContent = {
    1: {
      title: "Stage 1: Preparación",
      content: "Aquí comenzarás tu preparación con clases de inglés técnico y fundamentos de computación.",
    },
    2: {
      title: "Stage 2: Especialización",
      content:
        "Elige tu especialización: Programación Web, Community Manager, Social Media Manager, o Marketing Digital.",
    },
    3: {
      title: "Stage 3: Reclutamiento",
      content: "Te conectamos con oportunidades laborales y proyectos freelance.",
    },
  }

  const data = stageContent[stage]
  if (data) {
    showNotification(`${data.title}: ${data.content}`, "info")
  }
}

function showUserDashboard() {
  if (!currentUser) return

  alert(
    `Dashboard de ${currentUser.name}\nStage Actual: ${currentUser.stage}\nStages Completados: ${currentUser.completedStages.length}`,
  )
}

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type === "error" ? "danger" : type} alert-dismissible fade show position-fixed`
  notification.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"

  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Logout function
function logout() {
  currentUser = null
  localStorage.removeItem("kingdomCoderUser")
  location.reload()
}

// Add CSS for score circle
const additionalCSS = `
.score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: conic-gradient(var(--accent-color) 0deg, var(--accent-color) calc(3.6deg * var(--score, 0)), #e9ecef calc(3.6deg * var(--score, 0)), #e9ecef 360deg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.score-circle::before {
    content: '';
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: white;
}

.score-text {
    position: relative;
    z-index: 1;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
}
`

// Add the CSS to the page
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalCSS
document.head.appendChild(styleSheet)
*/