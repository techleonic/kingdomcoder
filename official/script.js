document.addEventListener("DOMContentLoaded", () => {
  console.log("Kingdom Coder website loaded successfully!")

  // Authentication state management
  let isLoggedIn = false
  let currentUser = null
  const Swal = window.Swal // Declare Swal variable
  const bootstrap = window.bootstrap // Declare bootstrap variable

  // Check if user is logged in (from localStorage)
  function checkAuthState() {
    const userData = localStorage.getItem("kingdomCoderUser")
    if (userData) {
      try {
        currentUser = JSON.parse(userData)
        isLoggedIn = true
        updateNavbar()
        console.log("User logged in:", currentUser.firstName)
      } catch (e) {
        console.error("Error parsing user data:", e)
        localStorage.removeItem("kingdomCoderUser")
      }
    }
  }

  // Update navbar based on auth state
  function updateNavbar() {
    const authButtons = document.getElementById("authButtons")
    const userMenu = document.getElementById("userMenu")
    const userName = document.getElementById("userName")

    if (isLoggedIn && currentUser) {
      authButtons.classList.add("d-none")
      userMenu.classList.remove("d-none")
      userName.textContent = currentUser.firstName + " " + currentUser.lastName
    } else {
      authButtons.classList.remove("d-none")
      userMenu.classList.add("d-none")
    }
  }

  // Logout functionality
  function logout() {
    localStorage.removeItem("kingdomCoderUser")
    isLoggedIn = false
    currentUser = null
    updateNavbar()

    Swal.fire({
      title: "Sesión cerrada",
      text: "Has cerrado sesión exitosamente",
      icon: "success",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#1e3a5f",
    })
  }

  // Password toggle functionality
  function setupPasswordToggle(passwordFieldId, toggleButtonId) {
    const passwordField = document.getElementById(passwordFieldId)
    const toggleButton = document.getElementById(toggleButtonId)

    if (passwordField && toggleButton) {
      toggleButton.addEventListener("click", () => {
        const type = passwordField.getAttribute("type") === "password" ? "text" : "password"
        passwordField.setAttribute("type", type)

        const icon = toggleButton.querySelector("i")
        if (type === "password") {
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        } else {
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        }
      })
    }
  }

  // Email validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Password strength checker
  function checkPasswordStrength(password) {
    let strength = 0
    let feedback = ""

    if (password.length >= 8) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++

    switch (strength) {
      case 0:
      case 1:
      case 2:
        feedback = "Débil - Agrega más caracteres, números y símbolos"
        return { strength: "weak", feedback }
      case 3:
      case 4:
        feedback = "Media - Buena, pero puede ser más fuerte"
        return { strength: "medium", feedback }
      case 5:
        feedback = "Fuerte - Excelente contraseña"
        return { strength: "strong", feedback }
      default:
        return { strength: "weak", feedback: "Muy débil" }
    }
  }

  // Initialize password toggles
  setupPasswordToggle("signinPassword", "toggleSigninPassword")
  setupPasswordToggle("signupPassword", "toggleSignupPassword")

  // Password strength indicator
  const signupPassword = document.getElementById("signupPassword")
  const passwordStrength = document.getElementById("passwordStrength")

  if (signupPassword && passwordStrength) {
    signupPassword.addEventListener("input", function () {
      const password = this.value
      if (password.length === 0) {
        passwordStrength.textContent = "La contraseña debe tener al menos 8 caracteres"
        passwordStrength.className = "form-text text-muted"
        return
      }

      const result = checkPasswordStrength(password)
      passwordStrength.textContent = result.feedback

      if (result.strength === "weak") {
        passwordStrength.className = "form-text text-danger"
      } else if (result.strength === "medium") {
        passwordStrength.className = "form-text text-warning"
      } else {
        passwordStrength.className = "form-text text-success"
      }
    })
  }

  // Password match checker
  const signupConfirmPassword = document.getElementById("signupConfirmPassword")
  const passwordMatch = document.getElementById("passwordMatch")

  if (signupConfirmPassword && passwordMatch && signupPassword) {
    signupConfirmPassword.addEventListener("input", function () {
      const password = signupPassword.value
      const confirmPassword = this.value

      if (confirmPassword === "") {
        passwordMatch.textContent = ""
        passwordMatch.className = "form-text"
        return
      }

      if (password === confirmPassword) {
        passwordMatch.textContent = "Las contraseñas coinciden"
        passwordMatch.className = "form-text text-success"
      } else {
        passwordMatch.textContent = "Las contraseñas no coinciden"
        passwordMatch.className = "form-text text-danger"
      }
    })
  }

  // Sign In Form
  const signinForm = document.getElementById("signinForm")
  if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = document.getElementById("signinEmail").value.trim()
      const password = document.getElementById("signinPassword").value
      const rememberMe = document.getElementById("rememberMe").checked

      // Validate inputs
      if (!validateEmail(email)) {
        Swal.fire({
          title: "Error",
          text: "Por favor ingresa un correo electrónico válido",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      if (password.length < 6) {
        Swal.fire({
          title: "Error",
          text: "La contraseña debe tener al menos 6 caracteres",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      // Show loading
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...'
      submitBtn.disabled = true

      // Simulate authentication
      setTimeout(() => {
        // Check if user exists in localStorage (for demo purposes)
        const existingUsers = JSON.parse(localStorage.getItem("kingdomCoderUsers") || "[]")
        const user = existingUsers.find((u) => u.email === email)

        if (user && user.password === password) {
          // Successful login
          currentUser = user
          isLoggedIn = true

          if (rememberMe) {
            localStorage.setItem("kingdomCoderUser", JSON.stringify(user))
          }

          updateNavbar()

          // Close modal
          const modal = bootstrap.Modal.getInstance(document.getElementById("signinModal"))
          if (modal) modal.hide()

          Swal.fire({
            title: "¡Bienvenido!",
            text: `Hola ${user.firstName}, has iniciado sesión exitosamente`,
            icon: "success",
            confirmButtonText: "Continuar",
            confirmButtonColor: "#1e3a5f",
          })

          signinForm.reset()
        } else {
          // Failed login
          Swal.fire({
            title: "Error de autenticación",
            text: "Correo electrónico o contraseña incorrectos",
            icon: "error",
            confirmButtonText: "Intentar de nuevo",
            confirmButtonColor: "#1e3a5f",
          })
        }

        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 1500)
    })
  }

  // Sign Up Form
  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const firstName = document.getElementById("signupFirstName").value.trim()
      const lastName = document.getElementById("signupLastName").value.trim()
      const email = document.getElementById("signupEmail").value.trim()
      const phone = document.getElementById("signupPhone").value.trim()
      const password = document.getElementById("signupPassword").value
      const confirmPassword = document.getElementById("signupConfirmPassword").value
      const program = document.getElementById("signupProgram").value
      const termsAccepted = document.getElementById("signupTerms").checked
      const newsletter = document.getElementById("signupNewsletter").checked

      // Validate inputs
      if (!firstName || !lastName) {
        Swal.fire({
          title: "Error",
          text: "Por favor completa tu nombre y apellido",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      if (!validateEmail(email)) {
        Swal.fire({
          title: "Error",
          text: "Por favor ingresa un correo electrónico válido",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      if (password.length < 8) {
        Swal.fire({
          title: "Error",
          text: "La contraseña debe tener al menos 8 caracteres",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      if (password !== confirmPassword) {
        Swal.fire({
          title: "Error",
          text: "Las contraseñas no coinciden",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      if (!termsAccepted) {
        Swal.fire({
          title: "Error",
          text: "Debes aceptar los términos y condiciones",
          icon: "error",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      // Show loading
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...'
      submitBtn.disabled = true

      // Simulate registration
      setTimeout(() => {
        // Check if email already exists
        const existingUsers = JSON.parse(localStorage.getItem("kingdomCoderUsers") || "[]")
        const emailExists = existingUsers.some((u) => u.email === email)

        if (emailExists) {
          Swal.fire({
            title: "Error",
            text: "Ya existe una cuenta con este correo electrónico",
            icon: "error",
            confirmButtonColor: "#1e3a5f",
          })

          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          return
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          firstName,
          lastName,
          email,
          phone,
          password,
          program,
          newsletter,
          registrationDate: new Date().toISOString(),
          isActive: true,
        }

        // Save user
        existingUsers.push(newUser)
        localStorage.setItem("kingdomCoderUsers", JSON.stringify(existingUsers))

        // Auto login
        currentUser = newUser
        isLoggedIn = true
        localStorage.setItem("kingdomCoderUser", JSON.stringify(newUser))
        updateNavbar()

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"))
        if (modal) modal.hide()

        Swal.fire({
          title: "¡Cuenta creada exitosamente!",
          text: `Bienvenido ${firstName}! Tu cuenta ha sido creada y ya has iniciado sesión.`,
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#1e3a5f",
        })

        signupForm.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 2000)
    })
  }

  // Forgot Password Form
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = document.getElementById("forgotEmail").value.trim()

      if (!validateEmail(email)) {
        Swal.fire({
          title: "Error",
          text: "Por favor ingresa un correo electrónico válido",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      // Show loading
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
      submitBtn.disabled = true

      // Simulate sending reset email
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"))
        if (modal) modal.hide()

        Swal.fire({
          title: "Correo enviado",
          text: `Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`,
          icon: "success",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#1e3a5f",
        })

        forgotPasswordForm.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 1500)
    })
  }

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const name = document.getElementById("contactName").value.trim()
      const email = document.getElementById("contactEmail").value.trim()
      const subject = document.getElementById("contactSubject").value.trim()
      const message = document.getElementById("contactMessage").value.trim()

      if (!name || !email || !subject || !message) {
        Swal.fire({
          title: "Error",
          text: "Por favor completa todos los campos",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      if (!validateEmail(email)) {
        Swal.fire({
          title: "Error",
          text: "Por favor ingresa un correo electrónico válido",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
          confirmButtonColor: "#1e3a5f",
        })
        return
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
      submitBtn.disabled = true

      setTimeout(() => {
        Swal.fire({
          title: "¡Mensaje enviado!",
          text: `Gracias ${name} por contactarnos. Te responderemos a la brevedad.`,
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#1e3a5f",
        })

        contactForm.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 1500)
    })
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const navbarHeight = 80 // Fixed navbar height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Initialize auth state
  checkAuthState()

  console.log("All event listeners initialized successfully!")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".custom-navbar")
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Scroll indicator click handler
  const scrollIndicator = document.querySelector(".scroll-indicator")
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      document.querySelector("#programs").scrollIntoView({
        behavior: "smooth",
      })
    })
  }

  // Enhanced form validation with modern feedback
  function addModernValidation() {
    const inputs = document.querySelectorAll(".modern-input")

    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.checkValidity()) {
          this.classList.remove("is-invalid")
          this.classList.add("is-valid")
        } else {
          this.classList.remove("is-valid")
          this.classList.add("is-invalid")
        }
      })

      input.addEventListener("input", function () {
        if (this.classList.contains("is-invalid") && this.checkValidity()) {
          this.classList.remove("is-invalid")
          this.classList.add("is-valid")
        }
      })
    })
  }

  // Initialize modern validation
  addModernValidation()

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallax = document.querySelector(".hero-bg")
    if (parallax) {
      const speed = scrolled * 0.5
      parallax.style.transform = `translateY(${speed}px)`
    }
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-slide-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".program-card, .feature-item").forEach((el) => {
    observer.observe(el)
  })

  // Enhanced modal transitions
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("show.bs.modal", function () {
      this.style.display = "block"
      this.classList.add("animate-fade-scale")
    })

    modal.addEventListener("hidden.bs.modal", function () {
      this.classList.remove("animate-fade-scale")
    })
  })

  // Add ripple effect to buttons
  function createRipple(event) {
    const button = event.currentTarget
    const circle = document.createElement("span")
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2

    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`
    circle.classList.add("ripple")

    const ripple = button.getElementsByClassName("ripple")[0]
    if (ripple) {
      ripple.remove()
    }

    button.appendChild(circle)
  }

  // Apply ripple effect to modern buttons
  document.querySelectorAll(".modern-btn").forEach((button) => {
    button.addEventListener("click", createRipple)
  })

  // Add CSS for ripple effect
  const rippleStyle = document.createElement("style")
  rippleStyle.textContent = `
    .modern-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`
  document.head.appendChild(rippleStyle)

  // Enhanced loading states
  function showLoadingState(button, loadingText) {
    const originalText = button.innerHTML
    button.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${loadingText}`
    button.disabled = true
    return originalText
  }

  function hideLoadingState(button, originalText) {
    button.innerHTML = originalText
    button.disabled = false
  }

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number")

    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/\D/g, ""))
      const increment = target / 50
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          counter.textContent = counter.textContent.replace(/\d+/, target)
          clearInterval(timer)
        } else {
          counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current))
        }
      }, 50)
    })
  }

  // Trigger counter animation when hero section is visible
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters()
          heroObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  const heroSection = document.querySelector(".hero-section")
  if (heroSection) {
    heroObserver.observe(heroSection)
  }

  console.log("Modern enhancements loaded successfully!")
})
