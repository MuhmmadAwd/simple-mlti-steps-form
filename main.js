let currentTab = 0;
const tabsEl = document.getElementsByClassName("tab");
const formEl = document.getElementById("regForm");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


showCurrentTab(currentTab)

function showCurrentTab(tabIndex) {
    tabsEl[tabIndex].style.display = "grid"
    updateTabBtn(tabIndex)
    updateStepIndicator(tabIndex)
}

function updateTabBtn(tabIndex) {
    prevBtn.style.display = !tabIndex ? "none" : "inline"
    nextBtn.innerHTML = (tabsEl.length - 1) == tabIndex ? "Submit" : "Next"
}

function updateStepIndicator(tabIndex) {
    const stepsEl = document.getElementsByClassName("step")
    Array.from(stepsEl).forEach(stepEl => stepEl.className = "step");
    stepsEl[tabIndex].className += " done"
}

// update the current tab based on currentTab and num value 
// `num` from html onclick event
function handleBtnClick(num) {
    if (num == 1 && !validateForm()) return false

    tabsEl[currentTab].style.display = "none"
    currentTab = currentTab + num
    if (currentTab !== tabsEl.length) {
        showCurrentTab(currentTab)
    } else {
        nextBtn.type = "submit"
    }
}

function validateForm() {
    const inputsEl = tabsEl[currentTab].getElementsByTagName("input")
    let isValid = true;
    for (let i = 0; i < inputsEl.length; i++) {
        const type = inputsEl[i].type
        const value = inputsEl[i].value
        if (!value) {
            isValid = isRequired(inputsEl[i].name)
        } else if (type === "date") {
            isValid = isOver18(value)
        } else if (type == "email") {
            isValid = isEmailValid(value)
        }
    }

    return isValid;
}

function isRequired(name) {
    displayError(`${name} is required`)
    return false
}

function isOver18(dateStr) {
    const birthDate = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        displayError(`You must be 18 or older to register.`)
        return !isValid
    }
    return isValid

}

function isEmailValid(value) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    isValid = regex.test(value);
    if (!isValid) {
        displayError(`email should be like name@example.com`)
    }
    return isValid
}

formEl.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(formEl);
    const values = [...formData];
    Swal.fire({
        title: 'Success!',
        text: 'Your registration data has been saved.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    renderFormData(values);
}

function renderFormData(values) {
    let inputValue = ""
    values.forEach((value) => {
        inputValue += `<li class="value">${value.join(" : ")}</li>`
    });
    formEl.innerHTML = ""
    document.querySelector(".form-summery").innerHTML = inputValue
}

function displayError(message) {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    })
}