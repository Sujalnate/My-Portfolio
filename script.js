// Global Variables
let currentProject = "ecommerce"
let ecommerceCart = JSON.parse(localStorage.getItem("ecommerceCart")) || []
let students = JSON.parse(localStorage.getItem("students")) || []
let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || []

// Calculator Variables
let calcCurrentInput = "0"
let calcPreviousInput = ""
let calcOperator = null
let calcWaitingForOperand = false

// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  })
})

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Animation System
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Add animation classes and observe elements
  const fadeElements = document.querySelectorAll(".section-title, .skill-category, .contact-info, .contact-form")
  fadeElements.forEach((el) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })

  const slideLeftElements = document.querySelectorAll(".about-text, .hero-content")
  slideLeftElements.forEach((el) => {
    el.classList.add("slide-in-left")
    observer.observe(el)
  })

  const slideRightElements = document.querySelectorAll(".about-image, .hero-image")
  slideRightElements.forEach((el) => {
    el.classList.add("slide-in-right")
    observer.observe(el)
  })
}

// Skill bars animation
function initializeSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target
          const width = skillBar.getAttribute("data-width")
          setTimeout(() => {
            skillBar.style.width = width + "%"
          }, 200)
        }
      })
    },
    { threshold: 0.5 },
  )

  skillBars.forEach((bar) => {
    skillObserver.observe(bar)
  })
}

// Contact form handling
function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")

  if (!name || !email || !subject || !message) {
    showNotification("Please fill in all fields", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  showNotification("Message sent successfully! I'll get back to you soon.", "success")
  e.target.reset()
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Project Navigation
function showProject(projectName) {
  // Hide all project contents
  document.querySelectorAll(".project-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Remove active class from all nav buttons
  document.querySelectorAll(".project-nav-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected project
  document.getElementById(projectName + "-project").classList.add("active")

  // Add active class to clicked button
  event.target.classList.add("active")

  currentProject = projectName

  // Initialize project-specific functionality
  switch (projectName) {
    case "ecommerce":
      renderEcommerceProducts()
      break
    case "weather":
      loadDefaultWeather()
      break
    case "calculator":
      updateCalcDisplay()
      updateCalcHistoryPanel()
      break
    case "student":
      renderStudents()
      updateStudentStats()
      break
  }
}

// E-commerce Project
function initializeEcommerce() {
  renderEcommerceProducts()
  updateEcommerceCartUI()
}

const ecommerceProducts = [
  { id: 1, name: "Wireless Headphones", price: 99.99, description: "High-quality wireless headphones", icon: "🎧" },
  { id: 2, name: "Smart Watch", price: 199.99, description: "Feature-rich smartwatch", icon: "⌚" },
  { id: 3, name: "Laptop Stand", price: 49.99, description: "Ergonomic laptop stand", icon: "💻" },
  { id: 4, name: "Wireless Mouse", price: 29.99, description: "Precision wireless mouse", icon: "🖱️" },
  { id: 5, name: "USB-C Hub", price: 79.99, description: "Multi-port USB-C hub", icon: "🔌" },
  { id: 6, name: "Bluetooth Speaker", price: 89.99, description: "Portable Bluetooth speaker", icon: "🔊" },
]

function renderEcommerceProducts() {
  const productsContainer = document.getElementById("ecommerce-products")
  if (!productsContainer) return

  productsContainer.innerHTML = ""

  ecommerceProducts.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="addToEcommerceCart(${product.id})">
                Add to Cart
            </button>
        `
    productsContainer.appendChild(productCard)
  })
}

function addToEcommerceCart(productId) {
  const product = ecommerceProducts.find((p) => p.id === productId)
  const existingItem = ecommerceCart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    ecommerceCart.push({ ...product, quantity: 1 })
  }

  updateEcommerceCartUI()
  saveEcommerceCart()
  showNotification("Product added to cart!", "success")
}

function updateEcommerceCartUI() {
  const cartCount = document.getElementById("ecommerce-cart-count")
  const cartItems = document.getElementById("ecommerce-cart-items")
  const cartTotal = document.getElementById("ecommerce-cart-total")

  if (!cartCount || !cartItems || !cartTotal) return

  // Update cart count
  const totalItems = ecommerceCart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update cart items
  cartItems.innerHTML = ""
  ecommerceCart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateEcommerceQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateEcommerceQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `
    cartItems.appendChild(cartItem)
  })

  // Update total
  const total = ecommerceCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = total.toFixed(2)
}

function updateEcommerceQuantity(productId, change) {
  const item = ecommerceCart.find((item) => item.id === productId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      ecommerceCart = ecommerceCart.filter((item) => item.id !== productId)
    }
    updateEcommerceCartUI()
    saveEcommerceCart()
  }
}

function toggleEcommerceCart() {
  const cartSidebar = document.getElementById("ecommerce-cart-sidebar")
  if (cartSidebar) {
    cartSidebar.classList.toggle("active")
  }
}

function ecommerceCheckout() {
  if (ecommerceCart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  const total = ecommerceCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  showNotification(`Order placed successfully! Total: $${total.toFixed(2)}`, "success")

  ecommerceCart = []
  updateEcommerceCartUI()
  saveEcommerceCart()
  toggleEcommerceCart()
}

function saveEcommerceCart() {
  localStorage.setItem("ecommerceCart", JSON.stringify(ecommerceCart))
}

// Weather App Project
function initializeWeatherApp() {
  loadDefaultWeather()

  const cityInput = document.getElementById("weather-city-input")
  if (cityInput) {
    cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchWeather()
      }
    })
  }
}

function loadDefaultWeather() {
  setTimeout(() => {
    getWeatherData("New York")
  }, 500)
}

function searchWeather() {
  const cityInput = document.getElementById("weather-city-input")
  if (!cityInput) return

  const city = cityInput.value.trim()
  if (!city) {
    showNotification("Please enter a city name", "error")
    return
  }

  getWeatherData(city)
}

function getCurrentLocationWeather() {
  if (!navigator.geolocation) {
    showNotification("Geolocation is not supported by this browser", "error")
    return
  }

  showWeatherLoading()

  navigator.geolocation.getCurrentPosition(
    (position) => {
      getWeatherData("Your Location")
    },
    (error) => {
      showNotification("Unable to get your location", "error")
    },
  )
}

function getWeatherData(city) {
  showWeatherLoading()

  // Simulate API call with mock data
  setTimeout(() => {
    const mockWeatherData = getMockWeatherData(city)
    displayCurrentWeather(mockWeatherData)
    displayForecast(mockWeatherData.forecast)
  }, 1000)
}

function getMockWeatherData(city) {
  const weatherConditions = [
    { icon: "☀️", desc: "sunny", temp: 25 },
    { icon: "⛅", desc: "partly cloudy", temp: 22 },
    { icon: "☁️", desc: "cloudy", temp: 18 },
    { icon: "🌧️", desc: "rainy", temp: 15 },
    { icon: "⛈️", desc: "thunderstorm", temp: 20 },
  ]

  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

  return {
    city: city,
    temperature: randomCondition.temp + Math.floor(Math.random() * 10),
    description: randomCondition.desc,
    icon: randomCondition.icon,
    humidity: 60 + Math.floor(Math.random() * 30),
    windSpeed: 5 + Math.floor(Math.random() * 15),
    pressure: 1010 + Math.floor(Math.random() * 20),
    visibility: 8 + Math.floor(Math.random() * 7),
    forecast: generateForecast(),
  }
}

function generateForecast() {
  const days = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"]
  const conditions = [
    { icon: "☀️", desc: "sunny" },
    { icon: "⛅", desc: "partly cloudy" },
    { icon: "☁️", desc: "cloudy" },
    { icon: "🌧️", desc: "rainy" },
  ]

  return days.map((day) => {
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    return {
      day,
      icon: condition.icon,
      description: condition.desc,
      high: 20 + Math.floor(Math.random() * 15),
      low: 10 + Math.floor(Math.random() * 10),
    }
  })
}

function showWeatherLoading() {
  const currentWeather = document.getElementById("weather-current")
  const forecast = document.getElementById("weather-forecast")

  if (currentWeather) {
    currentWeather.innerHTML = `
            <div class="weather-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading weather data...</p>
            </div>
        `
  }

  if (forecast) {
    forecast.classList.add("hidden")
  }
}

function displayCurrentWeather(data) {
  const currentWeather = document.getElementById("weather-current")
  const forecast = document.getElementById("weather-forecast")

  if (!currentWeather) return

  currentWeather.innerHTML = `
        <div class="weather-info">
            <div class="weather-main">
                <h2 class="city-name">${data.city}</h2>
                <div class="weather-icon">${data.icon}</div>
                <div class="temperature">${data.temperature}°C</div>
                <div class="description">${data.description}</div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <div class="detail-value">${data.humidity}%</div>
                    <div class="detail-label">Humidity</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <div class="detail-value">${data.windSpeed} km/h</div>
                    <div class="detail-label">Wind Speed</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-thermometer-half"></i>
                    <div class="detail-value">${data.pressure} hPa</div>
                    <div class="detail-label">Pressure</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-eye"></i>
                    <div class="detail-value">${data.visibility} km</div>
                    <div class="detail-label">Visibility</div>
                </div>
            </div>
        </div>
    `

  if (forecast) {
    forecast.classList.remove("hidden")
  }
}

function displayForecast(forecastData) {
  const forecastGrid = document.getElementById("forecast-grid")
  if (!forecastGrid) return

  forecastGrid.innerHTML = forecastData
    .map(
      (day) => `
        <div class="forecast-card">
            <div class="forecast-date">${day.day}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temp">${day.high}°/${day.low}°</div>
            <div class="forecast-desc">${day.description}</div>
        </div>
    `,
    )
    .join("")
}

// Calculator Project
function initializeCalculator() {
  updateCalcDisplay()
  updateCalcHistoryPanel()
}

function updateCalcDisplay() {
  const currentElement = document.getElementById("calc-current")
  const historyElement = document.getElementById("calc-history")

  if (currentElement) {
    currentElement.textContent = calcCurrentInput
  }
  if (historyElement) {
    historyElement.textContent = calcPreviousInput + (calcOperator || "")
  }
}

function calcAppendNumber(number) {
  if (number === "π") {
    calcCurrentInput = Math.PI.toString()
  } else if (calcWaitingForOperand) {
    calcCurrentInput = number
    calcWaitingForOperand = false
  } else {
    calcCurrentInput = calcCurrentInput === "0" ? number : calcCurrentInput + number
  }
  updateCalcDisplay()
}

function calcAppendOperator(nextOperator) {
  const inputValue = Number.parseFloat(calcCurrentInput)

  if (calcPreviousInput === "") {
    calcPreviousInput = calcCurrentInput
  } else if (calcOperator) {
    const result = calcPerformCalculation()
    calcCurrentInput = String(result)
    calcPreviousInput = calcCurrentInput
  }

  calcWaitingForOperand = true
  calcOperator = nextOperator
  updateCalcDisplay()
}

function calcPerformCalculation() {
  const prev = Number.parseFloat(calcPreviousInput)
  const current = Number.parseFloat(calcCurrentInput)

  if (isNaN(prev) || isNaN(current)) return current

  switch (calcOperator) {
    case "+":
      return prev + current
    case "-":
      return prev - current
    case "*":
      return prev * current
    case "/":
      return current !== 0 ? prev / current : "Error"
    case "^":
      return Math.pow(prev, current)
    default:
      return current
  }
}

function calcCalculate() {
  if (calcOperator && calcPreviousInput !== "" && !calcWaitingForOperand) {
    const expression = `${calcPreviousInput} ${calcOperator} ${calcCurrentInput}`
    const result = calcPerformCalculation()

    calcAddToHistory(expression, result)

    calcCurrentInput = String(result)
    calcPreviousInput = ""
    calcOperator = null
    calcWaitingForOperand = true
    updateCalcDisplay()
  }
}

function calcFunction(func) {
  const current = Number.parseFloat(calcCurrentInput)
  let result
  let expression = `${func}(${current})`

  switch (func) {
    case "sin":
      result = Math.sin((current * Math.PI) / 180)
      break
    case "cos":
      result = Math.cos((current * Math.PI) / 180)
      break
    case "tan":
      result = Math.tan((current * Math.PI) / 180)
      break
    case "log":
      result = current > 0 ? Math.log10(current) : "Error"
      break
    case "ln":
      result = current > 0 ? Math.log(current) : "Error"
      break
    case "sqrt":
      result = current >= 0 ? Math.sqrt(current) : "Error"
      expression = `√${current}`
      break
    default:
      return
  }

  calcAddToHistory(expression, result)
  calcCurrentInput = String(result)
  calcWaitingForOperand = true
  updateCalcDisplay()
}

function calcClearAll() {
  calcCurrentInput = "0"
  calcPreviousInput = ""
  calcOperator = null
  calcWaitingForOperand = false
  updateCalcDisplay()
}

function calcClearEntry() {
  calcCurrentInput = "0"
  updateCalcDisplay()
}

function calcDeleteLast() {
  if (calcCurrentInput.length > 1) {
    calcCurrentInput = calcCurrentInput.slice(0, -1)
  } else {
    calcCurrentInput = "0"
  }
  updateCalcDisplay()
}

function calcAddToHistory(expression, result) {
  const historyItem = {
    expression,
    result,
    timestamp: new Date().toLocaleString(),
  }

  calcHistory.unshift(historyItem)

  if (calcHistory.length > 50) {
    calcHistory = calcHistory.slice(0, 50)
  }

  localStorage.setItem("calcHistory", JSON.stringify(calcHistory))
  updateCalcHistoryPanel()
}

function updateCalcHistoryPanel() {
  const historyList = document.getElementById("calc-history-list")
  if (!historyList) return

  if (calcHistory.length === 0) {
    historyList.innerHTML = '<p style="text-align: center; color: #666;">No calculations yet</p>'
    return
  }

  historyList.innerHTML = calcHistory
    .map(
      (item) => `
        <div class="calc-history-item" onclick="calcUseHistoryResult('${item.result}')">
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 2px;">${item.expression}</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #333;">= ${item.result}</div>
        </div>
    `,
    )
    .join("")
}

function calcUseHistoryResult(result) {
  calcCurrentInput = result
  calcWaitingForOperand = true
  updateCalcDisplay()
}

function calcClearHistory() {
  calcHistory = []
  localStorage.removeItem("calcHistory")
  updateCalcHistoryPanel()
  showNotification("History cleared", "success")
}

// Student Management Project
function initializeStudentManagement() {
  if (students.length === 0) {
    generateSampleStudents()
  }
  renderStudents()
  updateStudentStats()

  // Bind events
  const studentForm = document.getElementById("student-form")
  if (studentForm) {
    studentForm.addEventListener("submit", handleStudentForm)
  }
}

function generateSampleStudents() {
  students = [
    {
      id: "BCA001",
      name: "Rahul Sharma",
      email: "rahul@email.com",
      course: "BCA",
      year: "3",
      grade: 85,
      status: "Active",
    },
    {
      id: "BCA002",
      name: "Priya Patel",
      email: "priya@email.com",
      course: "BCA",
      year: "2",
      grade: 92,
      status: "Active",
    },
    {
      id: "MCA001",
      name: "Amit Kumar",
      email: "amit@email.com",
      course: "MCA",
      year: "1",
      grade: 78,
      status: "Active",
    },
    {
      id: "BSC001",
      name: "Sneha Singh",
      email: "sneha@email.com",
      course: "BSc IT",
      year: "3",
      grade: 88,
      status: "Active",
    },
  ]
  saveStudents()
}

function renderStudents() {
  const tbody = document.getElementById("student-table-body")
  if (!tbody) return

  const filteredStudents = getFilteredStudents()

  if (filteredStudents.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">
                    No students found
                </td>
            </tr>
        `
    return
  }

  tbody.innerHTML = filteredStudents
    .map(
      (student) => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.grade}%</td>
            <td>
                <span class="status-badge status-${student.status.toLowerCase()}">
                    ${student.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function getFilteredStudents() {
  const searchTerm = document.getElementById("student-search-input")?.value.toLowerCase() || ""
  const courseFilter = document.getElementById("student-course-filter")?.value || ""

  return students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm) || student.id.toLowerCase().includes(searchTerm)
    const matchesCourse = !courseFilter || student.course === courseFilter

    return matchesSearch && matchesCourse
  })
}

function updateStudentStats() {
  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "Active").length
  const averageGrade = totalStudents > 0 ? Math.round(students.reduce((sum, s) => sum + s.grade, 0) / totalStudents) : 0

  const totalElement = document.getElementById("total-students")
  const activeElement = document.getElementById("active-students")
  const averageElement = document.getElementById("average-grade")

  if (totalElement) totalElement.textContent = totalStudents
  if (activeElement) activeElement.textContent = activeStudents
  if (averageElement) averageElement.textContent = averageGrade + "%"
}

function searchStudents() {
  renderStudents()
}

function filterStudents() {
  renderStudents()
}

function showStudentModal() {
  const modal = document.getElementById("student-modal")
  const overlay = document.getElementById("modal-overlay")

  if (modal && overlay) {
    modal.classList.add("active")
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function handleStudentForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const studentData = {
    id: "STU" + String(students.length + 1).padStart(3, "0"),
    name: document.getElementById("student-name").value,
    email: document.getElementById("student-email").value,
    course: document.getElementById("student-course").value,
    year: document.getElementById("student-year").value,
    grade: Number.parseInt(document.getElementById("student-grade").value),
    status: document.getElementById("student-status").value,
  }

  if (validateStudent(studentData)) {
    students.push(studentData)
    saveStudents()
    renderStudents()
    updateStudentStats()
    closeModal("student-modal")
    showNotification("Student added successfully!", "success")
    e.target.reset()
  }
}

function validateStudent(student) {
  if (!student.name || !student.email || !student.course || !student.year || !student.grade || !student.status) {
    showNotification("Please fill in all fields!", "error")
    return false
  }

  if (student.grade < 0 || student.grade > 100) {
    showNotification("Grade must be between 0 and 100!", "error")
    return false
  }

  if (!isValidEmail(student.email)) {
    showNotification("Please enter a valid email address!", "error")
    return false
  }

  return true
}

function editStudent(studentId) {
  // Implementation for editing student
  showNotification("Edit functionality would be implemented here", "info")
}

function deleteStudent(studentId) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter((s) => s.id !== studentId)
    saveStudents()
    renderStudents()
    updateStudentStats()
    showNotification("Student deleted successfully!", "success")
  }
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students))
}

// Modal Functions
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  const overlay = document.getElementById("modal-overlay")

  if (modal) modal.classList.remove("active")
  if (overlay) overlay.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Notification System
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `

  // Add to page
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }
  }, 5000)
}

// Add active class to navigation links based on scroll position
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Add CSS for active nav link
const style = document.createElement("style")
style.textContent = `
    .nav-link.active {
        color: #2563eb !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`
document.head.appendChild(style)

// Keyboard support for calculator
document.addEventListener("keydown", (event) => {
  if (currentProject !== "calculator") return

  const key = event.key

  // Prevent default behavior for calculator keys
  if ("0123456789+-*/.=()".includes(key) || key === "Enter" || key === "Backspace" || key === "Escape") {
    event.preventDefault()
  }

  // Numbers
  if ("0123456789".includes(key)) {
    calcAppendNumber(key)
  }
  // Operators
  else if (key === "+") calcAppendOperator("+")
  else if (key === "-") calcAppendOperator("-")
  else if (key === "*") calcAppendOperator("*")
  else if (key === "/") calcAppendOperator("/")
  else if (key === ".") calcAppendNumber(".")
  // Special keys
  else if (key === "Enter" || key === "=") calcCalculate()
  else if (key === "Backspace") calcDeleteLast()
  else if (key === "Escape") calcClearAll()
})

// Resume Download Function
function downloadResume() {
  // Create a sample resume content
  const resumeContent = `
JOHN DOE
BCA Graduate & Full Stack Developer
Email: your.email@example.com | Phone: +91 12345 67890
Location: Your City, India

EDUCATION
Bachelor of Computer Applications (BCA)
Your University Name | 2021-2024
CGPA: 8.5/10

TECHNICAL SKILLS
Programming Languages: Python, JavaScript, C++
Web Technologies: HTML5, CSS3, React, Node.js
Databases: MySQL, MongoDB
Tools: Git, VS Code, GitHub

PROJECTS
1. E-commerce Website
   - Built a fully functional online store with shopping cart
   - Technologies: HTML, CSS, JavaScript
   - Features: Product catalog, cart management, checkout

2. Weather Application
   - Real-time weather forecasts with location-based data
   - Technologies: JavaScript, Weather API
   - Features: Current weather, 5-day forecast, geolocation

3. Scientific Calculator
   - Advanced calculator with scientific functions
   - Technologies: JavaScript, HTML, CSS
   - Features: Basic operations, scientific functions, history

4. Student Management System
   - Complete CRUD system for managing student records
   - Technologies: JavaScript, Local Storage
   - Features: Add/edit/delete students, search, statistics

EXPERIENCE
Fresher - Looking for opportunities in software development

CERTIFICATIONS
- Web Development Fundamentals
- JavaScript Programming
- Database Management Systems

ACHIEVEMENTS
- Dean's List for Academic Excellence
- Best Project Award for Final Year Project
- Active participant in coding competitions
  `

  // Create a blob with the resume content
  const blob = new Blob([resumeContent], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)

  // Create a temporary link element and trigger download
  const link = document.createElement("a")
  link.href = url
  link.download = "John_Doe_Resume.txt"
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  showNotification("Resume downloaded successfully!", "success")
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initializePortfolio()
  initializeProjects()
})

// Portfolio Initialization
function initializePortfolio() {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    navToggle.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Initialize animations
  initializeAnimations()

  // Contact form handling
  const contactForm = document.getElementById("contact-form")
  contactForm.addEventListener("submit", handleContactForm)

  // Skill bars animation
  initializeSkillBars()
}

// Initialize all projects
function initializeProjects() {
  initializeEcommerce()
  initializeWeatherApp()
  initializeCalculator()
  initializeStudentManagement()
}
