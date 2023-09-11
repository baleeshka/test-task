const modal = document.getElementById('modal')
const operatorNameInput = document.getElementById('operatorName')
const clientNameInput = document.getElementById('clientName')
const saveButton = document.getElementById('saveButton')
const mainPage = document.getElementById('main-page')
const tabs = document.querySelectorAll('.tab-button')
const tableBody = document.querySelector('#interactive-table tbody')
const interactiveTable = document.getElementById('interactive-table')
interactiveTable.style.display = 'none'

let operatorName = ''
let clientName = ''
let currentQuestionIndex = 0
let currentQuestion
const userAnswers = {}

const questions = [
	{
		topic: '',
		phrase: `<div>Перед работой с клиентом, откройте актуальную версию:<br>
                      - <b>Инструкцию по закрытию задач</b><br>
                      - <b>[Интерактив]&laquo;РСВ&raquo;НС1/НС2</b><br><br>
                      Удалось дозвониться?</div>`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 1,
			Нет: -4,
		},
	},
	{
		topic: '',
		phrase: `Здравствуйте, меня зовут <span style="color: blue;">{Ваше имя}</span>, я 
                      <span style="font-weight: bold; color: red;">Представляю Тинькофф</span>. Я разговариваю 
                      с <span style="color: blue;">{Имя клиента}</span>?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 2,
			Нет: 7,
		},
	},
	{
		topic: '',
		phrase: `Очень приятно, <span style="color: blue;">{Имя клиента}</span>. Вы готовы уделить мне 2-3 минуты Вашего внимания и ответить на пару вопросов?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 3,
			Нет: 8,
		},
	},
	{
		topic: '',
		phrase:
			`<span style="color: blue;">{Имя клиента}</span>, спасибо, что вы являетесь нашим клиентом. Позвольте сообщить, что мы подключаем Клиентам особую программу страхования, которая обеспечит Вам надёжную финансовую защиту при потере трудоспособности в результате несчастного случая, а также от потери работы.<br>` +
			'При наступлении страхового случая по рискам "Уход из жизни" в результате НС и "Инвалидность 1, 2 группы" в результате НС, размер страховой выплаты составит 160% от задолженности на дату наступления страхового случая. Например: если задолженность составляла 100 000 рублей, то страховая выплата составить 160 000 рублей.<br>' +
			'<br>' +
			'При наступлении страхового случая по риску "Потеря работы", задолженность в пределах 120 000 рублей будет погашена за счёт страховой компании.<br>' +
			'Скажите, вы готовы защитить себя от непредвиденных жизненных ситуаций?',
		options: ['Да', 'Нет'],
		conditions: {
			Да: 4,
			Нет: -1,
		},
	},
	{
		topic: '',
		phrase:
			`<span style="color: blue;">{Имя клиента}</span>, плата за услугу составляет всего 0,89% от суммы задолженности, на момент формирования счет-выписки. Например, в случае наличия задолженности в 1000 рублей плата за программу будет составлять всего 8 рублей 90 копеек в месяц. При этом, в случае, если задолженность отсутствует, то плата за программу не взимается.<br>` +
			`Согласитесь, это выгодное предложение?<br>` +
			'<br>' +
			'<b>ВАЖНО! Если клиент не согласен по критерию цены предлагай льготную программу</b>. <br>' +
			'<br>' +
			`<span style="color: blue;">{Имя клиента}</span>, в таком случае, я могу предложить вам эту же страховую программу, но на льготных условиях:<br>` +
			`В течение 90 дней после подключения плата за услугу &laquo;Страхование задолженности&raquo; не будет списываться, и Вы сможете оценить все достоинства услуги совершенно бесплатно. В дальнейшем плата за нее составит всего 0,89% от суммы задолженности.`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 5,
			Нет: -1,
		},
	},
	{
		topic: '',
		phrase: `Обращаю ваше внимание на то, что участниками программы не могут быть лица, старше 75 лет и страдающие психическими заболеваниями. С этими условиями согласны?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 6,
			Нет: -1,
		},
	},
	{
		topic: '',
		phrase:
			`<b>В таком случае вы будете застрахованы от рисков получения инвалидности 1, 2 группы в результате НС, ухода из жизни в результате НС, а так же от потери работы. <span style="color: red;">Инвалидность в результате болезни в покрытие не входит.</span><br>` +
			'<br>' +
			'Скажите, Вы согласны стать участником этой программы?<br>' +
			'<br>' +
			'ВАЖНО!</b> Если клиент сообщает, что ему ранее была присвоена группа инвалидности, то необходимо пояснить, что в этом случае программа будет покрывать только риск уход из жизни в результате НС.',
		options: ['Да', 'Нет'],
		conditions: {
			Да: -2,
			Нет: -1,
		},
	},
	{
		topic: '',
		phrase: `Скажите, вы знакомы с <span style="color: blue;">{Имя клиента}</span>?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 8,
			Нет: -5,
		},
	},
	{
		topic: '',
		phrase: `Подскажите, когда можно будет перезвонить, чтобы поговорить с <span style="color: blue;">{Имя клиента}</span>?`,
		options: ['Сообщает время', 'Не сообщает время'],
		conditions: {
			'Сообщает время': -3,
			'Не сообщает время': -3,
		},
	},
]

function getFinalText(selectedAnswer, clientName) {
	if (selectedAnswer === -1) {
		return (
			`<span style="color: red;">Проведи РСВ согласно процедуре.</span>.<br>` +
			`<br>` +
			`Если работы с возражениями проведена и клиент всё равно отказался, то:<br>` +
			`1) Сообщить: <span style="color: blue;">${clientName}</span>, Благодарю вас за уделённое время. Если возникнет желание подключить услугу страхования жизни, можете это сделать в мобильном приложении или на сайте www.tinkoff.ru <br>` +
			`<br>` +
			`2) Перейти во вкладку &laquo;<span style="color: blue;">Отказ</span>&raquo;, закрыть задачу согласно соответствующей инструкции.`
		)
	} else if (selectedAnswer === -2) {
		return (
			`Плата за страхование будет списываться с вашей карты ежемесячно. Программа начнёт действовать с момента формирования следующей счёт-выписки. В случае нежелания далее получать страховую защиту, вы можете в любое время отключить её в мобильном приложении или в личном кабинете на сайте www.tinkoff.ru. Благодарю вас. Услуга страхования успешно подключена. Всего доброго, до свидания.<br>` +
			`<br>` +
			`Перейти в &laquo;<span style="color: blue;">Дозвон-Успешно</span>&raquo; Работаем согласно инструкции по закрытию задач`
		)
	} else if (selectedAnswer === -3) {
		return `Перейти во вкладку &laquo;<span style="color: blue;">Перезвон</span>&raquo; Работаем согласно инструкции по закрытию  задач.`
	} else if (selectedAnswer === -4) {
		return `Перейти в раздел &laquo;<span style="color: blue;">Недозвон</span>&raquo; Работаем согласно инструкции по закрытию  задач.`
	} else if (selectedAnswer === -5) {
		return (
			`Приношу извинения. Всего доброго!<br>` +
			`<br>` +
			`Перейти в раздел &laquo;<span style="color: blue;">Отказ</span>&raquo; Работаем согласно инструкции по закрытию  задач.`
		)
	}
}

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
			interactiveTable.style.display = 'none'
		} else if (section === 'missed-call') {
			mainPage.innerHTML = ''
			interactiveTable.style.display = 'none'
		} else if (section === 'callback') {
			mainPage.innerHTML = ''
			interactiveTable.style.display = 'none'
		} else if (section === 'telephony-error') {
			mainPage.innerHTML = ''
			interactiveTable.style.display = 'none'
		}
	})
})

modal.style.display = 'block'
mainPage.style.display = 'none'
