const modal = document.getElementById('modal')
const operatorNameInput = document.getElementById('operatorName')
const clientNameInput = document.getElementById('clientName')
const saveButton = document.getElementById('saveButton')
const mainPage = document.getElementById('main-page')
const tabs = document.querySelectorAll('.tab-button')
const tableBody = document.querySelector('#interactive-table tbody')
const interactiveTable = document.getElementById('interactive-table')
interactiveTable.style.display = 'none'
import getFinalText from './getFinalText.js'
import questions from './questions.js'

let operatorName = ''
let clientName = ''
let currentQuestionIndex = 0
let currentQuestion
const userAnswers = {}

saveButton.addEventListener('click', () => {
	operatorName = operatorNameInput.value
	clientName = clientNameInput.value

	modal.style.display = 'none'
	mainPage.style.display = 'block'
	interactiveTable.style.display = ''

	showNextQuestion()
})

function showNextQuestion() {
	if (currentQuestionIndex < questions.length) {
		currentQuestion = questions[currentQuestionIndex]

		const savedAnswer = userAnswers[currentQuestionIndex]

		const phraseWithNames = currentQuestion.phrase
			.replaceAll('{Ваше имя}', operatorName)
			.replaceAll('{Имя клиента}', clientName)

		const row = document.createElement('tr')
		row.setAttribute('data-question-index', currentQuestionIndex)
		row.innerHTML = `
      <td>${currentQuestion.topic}</td>
      <td>${phraseWithNames}</td>
      <td>
        <input type="radio" id="option${currentQuestionIndex}-1" name="answer${currentQuestionIndex}" value="${
			currentQuestion.options[0]
		}" ${savedAnswer === currentQuestion.options[0] ? 'checked' : ''}>
        <label for="option${currentQuestionIndex}-1">${
			currentQuestion.options[0]
		}</label><br>
        <input type="radio" id="option${currentQuestionIndex}-2" name="answer${currentQuestionIndex}" value="${
			currentQuestion.options[1]
		}" ${savedAnswer === currentQuestion.options[1] ? 'checked' : ''}>
        <label for="option${currentQuestionIndex}-2">${
			currentQuestion.options[1]
		}</label><br>
      </td>
    `

		tableBody.appendChild(row)

		const radioButtons = document.querySelectorAll(
			`input[name="answer${currentQuestionIndex}"]`
		)
		radioButtons.forEach(radioButton => {
			radioButton.addEventListener('change', handleRadioButtonChange)
		})
	}
}

function handleRadioButtonChange(event) {
	const selectedAnswer = event.target.value

	const questionIndex = parseInt(event.target.name.match(/\d+/)[0])

	const finalRowsToRemove = document.querySelectorAll(`tr[data-final="true"]`)
	finalRowsToRemove.forEach(row => {
		if (row.getAttribute('data-question-index') >= questionIndex) {
			row.remove()
		}
	})

	for (let i = questionIndex + 1; i < questions.length; i++) {
		delete userAnswers[i]
	}

	for (let i = questionIndex + 1; i < questions.length; i++) {
		const rowToRemove = document.querySelector(`tr[data-question-index="${i}"]`)
		if (rowToRemove) {
			rowToRemove.remove()
		}
	}

	userAnswers[questionIndex] = selectedAnswer

	const nextQuestionIndex = questions[questionIndex].conditions[selectedAnswer]

	if (nextQuestionIndex >= 0 && nextQuestionIndex < questions.length) {
		currentQuestionIndex = nextQuestionIndex
		showNextQuestion()
	} else {
		console.log(
			'Цепочка вопросов завершена или произошла ошибка.',
			nextQuestionIndex
		)
		const finalText = getFinalText(nextQuestionIndex, clientName)

		const row = document.createElement('tr')
		row.setAttribute('data-final', 'true')
		row.innerHTML = `
        <td></td>
        <td>${finalText}</td>
        <td></td>
      `

		tableBody.appendChild(row)
	}
}

tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		tabs.forEach(t => t.classList.remove('active'))
		tab.classList.add('active')

		const section = tab.getAttribute('data-section')

		const mainPage = document.getElementById('main-page')
		if (section === 'presentation') {
			mainPage.innerHTML = ''
			interactiveTable.style.display = ''
		} else if (section === 'successful-call') {
			mainPage.innerHTML = ''
			interactiveTable.style.display = 'none'

			const successfulCallSection = document.createElement('div')
			successfulCallSection.id = 'successful-call-section'

			const paidServiceRadio = document.createElement('label')
			paidServiceRadio.innerHTML = `
				<input type="radio" name="serviceType" value="Платная"> Подключение ПЛАТНОЙ услуги
			`

			const freeServiceRadio = document.createElement('label')
			freeServiceRadio.innerHTML = `
				<input type="radio" name="serviceType" value="Бесплатная"> Подключение БЕСПЛАТНОЙ услуги
			`

			const finishButton = document.createElement('button')
			finishButton.id = 'finishButton'
			finishButton.style.color = 'white'
			finishButton.textContent = 'Завершить работу с заданием'

			successfulCallSection.appendChild(paidServiceRadio)
			successfulCallSection.appendChild(document.createElement('br'))
			successfulCallSection.appendChild(freeServiceRadio)
			successfulCallSection.appendChild(document.createElement('br'))
			successfulCallSection.appendChild(finishButton)

			mainPage.appendChild(successfulCallSection)

			mainPage.style.display = 'block'
		} else if (section === 'rejected-call') {
			mainPage.innerHTML = ''

			const callRejectionSection = document.createElement('div')
			callRejectionSection.id = 'call-rejection-section'

			const radioOptions = [
				'Перезвонит самостоятельно',
				'Не звонить',
				'Не устраивают условия',
				'Не устраивает цена',
				'Уже застрахован',
				'Не доверяет компании',
				'Не подходит требованиям программы',
				'Отказался от услуги',
				'Номер не принадлежит клиенту',
				'Другая причина',
			]

			radioOptions.forEach((option, index) => {
				const radioButton = document.createElement('input')
				radioButton.type = 'radio'
				radioButton.name = 'rejectionReason'
				radioButton.value = index + 1

				const label = document.createElement('label')
				label.appendChild(radioButton)
				label.appendChild(document.createTextNode(` ${index + 1} ${option}`))

				callRejectionSection.appendChild(label)
				callRejectionSection.appendChild(document.createElement('br'))
			})

			const commentLabel = document.createElement('label')
			commentLabel.innerHTML = 'Комментарий:'
			const commentTextArea = document.createElement('textarea')
			commentTextArea.rows = 4
			commentTextArea.cols = 50

			const finishButton = document.createElement('button')
			finishButton.textContent = 'Завершить работу с заданием'

			callRejectionSection.appendChild(commentLabel)
			callRejectionSection.appendChild(document.createElement('br'))
			callRejectionSection.appendChild(commentTextArea)
			callRejectionSection.appendChild(document.createElement('br'))
			callRejectionSection.appendChild(finishButton)

			mainPage.appendChild(callRejectionSection)
			interactiveTable.style.display = 'none'
		} else if (section === 'missed-call') {
			mainPage.innerHTML = ''

			const callFailureSection = document.createElement('div')
			callFailureSection.id = 'call-failure-section'

			const radioOptions = [
				'Клиент не отвечает',
				'Телефон не существует',
				'Занято',
				'Клиент сбрасывает вызов',
				'Телефон абонента выключен',
			]

			radioOptions.forEach((option, index) => {
				const radioButton = document.createElement('input')
				radioButton.type = 'radio'
				radioButton.name = 'callFailureReason'
				radioButton.value = option

				const label = document.createElement('label')
				label.appendChild(radioButton)
				label.appendChild(document.createTextNode(` ${option}`))

				callFailureSection.appendChild(label)
				callFailureSection.appendChild(document.createElement('br'))
			})

			const commentLabel = document.createElement('label')
			commentLabel.innerHTML = 'Комментарий:'
			const commentTextArea = document.createElement('textarea')
			commentTextArea.rows = 4
			commentTextArea.cols = 50

			const finishButton = document.createElement('button')
			finishButton.textContent = 'Завершить работу с заданием'

			callFailureSection.appendChild(commentLabel)
			callFailureSection.appendChild(document.createElement('br'))
			callFailureSection.appendChild(commentTextArea)
			callFailureSection.appendChild(document.createElement('br'))
			callFailureSection.appendChild(finishButton)

			mainPage.appendChild(callFailureSection)
			interactiveTable.style.display = 'none'
		} else if (section === 'callback') {
			mainPage.innerHTML = ''

			const recallSection = document.createElement('div')
			recallSection.id = 'recall-section'

			const radioOptions = [
				'Звонок сорвался',
				'Нет требуемых данных',
				'По просьбе клиента/3-го лица',
			]

			radioOptions.forEach((option, index) => {
				const radioButton = document.createElement('input')
				radioButton.type = 'radio'
				radioButton.name = 'recallReason'
				radioButton.value = option

				const label = document.createElement('label')
				label.appendChild(radioButton)
				label.appendChild(document.createTextNode(` ${option}`))

				recallSection.appendChild(label)
				recallSection.appendChild(document.createElement('br'))
			})

			const recallTimeCheckbox = document.createElement('input')
			recallTimeCheckbox.type = 'checkbox'
			recallTimeCheckbox.id = 'recall-time-checkbox'

			const recallTimeLabel = document.createElement('label')
			recallTimeLabel.innerHTML = 'Время перезвона выбрано'

			const recallDateInput = document.createElement('input')
			recallDateInput.type = 'date'
			recallDateInput.id = 'recall-date-input'
			recallDateInput.style.display = 'none' // По умолчанию скрыто

			recallTimeCheckbox.addEventListener('change', function () {
				if (this.checked) {
					recallDateInput.style.display = 'block'
				} else {
					recallDateInput.style.display = 'none'
				}
			})

			const commentLabel = document.createElement('label')
			commentLabel.innerHTML = 'Комментарий:'
			const commentTextArea = document.createElement('textarea')
			commentTextArea.rows = 4
			commentTextArea.cols = 50

			const finishButton = document.createElement('button')
			finishButton.textContent = 'Завершить работу с заданием'

			recallSection.appendChild(recallTimeCheckbox)
			recallSection.appendChild(recallTimeLabel)
			recallSection.appendChild(document.createElement('br'))
			recallSection.appendChild(recallDateInput)
			recallSection.appendChild(document.createElement('br'))
			recallSection.appendChild(commentLabel)
			recallSection.appendChild(document.createElement('br'))
			recallSection.appendChild(commentTextArea)
			recallSection.appendChild(document.createElement('br'))
			recallSection.appendChild(finishButton)

			mainPage.appendChild(recallSection)
			interactiveTable.style.display = 'none'
		} else if (section === 'telephony-error') {
			mainPage.innerHTML = ''

			const telephonyErrorSection = document.createElement('div')
			telephonyErrorSection.id = 'telephony-error-section'

			const commentLabel = document.createElement('label')
			commentLabel.innerHTML = 'Комментарий:'
			const commentTextArea = document.createElement('textarea')
			commentTextArea.rows = 4
			commentTextArea.cols = 50

			const finishButton = document.createElement('button')
			finishButton.textContent = 'Завершить работу с заданием'

			telephonyErrorSection.appendChild(commentLabel)
			telephonyErrorSection.appendChild(document.createElement('br'))
			telephonyErrorSection.appendChild(commentTextArea)
			telephonyErrorSection.appendChild(document.createElement('br'))
			telephonyErrorSection.appendChild(finishButton)

			mainPage.appendChild(telephonyErrorSection)
			interactiveTable.style.display = 'none'
		}
	})
})

modal.style.display = 'block'
mainPage.style.display = 'none'
