// script2.js

const tableBody = document.querySelector('#interactive-table tbody')
const modal = document.getElementById('modal')
const operatorNameInput = document.getElementById('operatorName')
const clientNameInput = document.getElementById('clientName')
const saveButton = document.getElementById('saveButton')
const mainPage = document.getElementById('main-page')
const tabs = document.querySelectorAll('.tab-button')
let operatorName = ''
let clientName = ''
let isQuestionnaireStarted = false

// Здесь определяем вопросы и варианты ответов
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
		phrase: `Здравствуйте, меня зовут <span style="color: blue;">${operatorName}</span>, я 
                      <span style="font-weight: bold; color: red;">Представляю Тинькофф</span>. Я разговариваю 
                      с <span style="color: blue;">${clientName}</span>?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 2,
			Нет: 7,
		},
	},
	{
		topic: '',
		phrase: `Очень приятно, <span style="color: blue;">${clientName}</span>. Вы готовы уделить мне 2-3 минуты Вашего внимания и ответить на пару вопросов?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 3,
			Нет: 9,
		},
	},
	{
		topic: '',
		phrase:
			`<span style="color: blue;">${clientName}</span>, спасибо, что вы являетесь нашим клиентом. Позвольте сообщить, что мы подключаем Клиентам особую программу страхования, которая обеспечит Вам надёжную финансовую защиту при потере трудоспособности в результате несчастного случая, а также от потери работы.<br>` +
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
			`<span style="color: blue;">${clientName}</span>, плата за услугу составляет всего 0,89% от суммы задолженности, на момент формирования счет-выписки. Например, в случае наличия задолженности в 1000 рублей плата за программу будет составлять всего 8 рублей 90 копеек в месяц. При этом, в случае, если задолженность отсутствует, то плата за программу не взимается.<br>' +
		'Согласитесь, это выгодное предложение?<br>` +
			'<br>' +
			'<b>ВАЖНО! Если клиент не согласен по критерию цены предлагай льготную программу</b>. <br>' +
			'<br>' +
			`<span style="color: blue;">${clientName}</span>, в таком случае, я могу предложить вам эту де страховую программу, но на льготных условиях:<br>' +
		'В течение 90 дней после подключения плата за услугу &laquo;Страхование задолженности&raquo; не будет списываться, и Вы сможете оценить все достоинства услуги совершенно бесплатно. В дальнейшем плата за нее составит всего 0,89% от суммы задолженности.`,
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
		phrase: `Скажите, вы знакомы с <span style="color: blue;">${clientName}</span>?`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: 8,
			Нет: -5,
		},
	},
	{
		topic: '',
		phrase: `Подскажите, когда можно будет перезвонить, чтобы поговорить с <span style="color: blue;">${clientName}</span>`,
		options: ['Да', 'Нет'],
		conditions: {
			Да: -3,
			Нет: -3,
		},
	},
]

// Функция для обновления фраз с именем оператора и клиента
function updateNamesInQuestions() {
	const operatorNameElements = document.querySelectorAll(
		'.operator-name-placeholder'
	)
	const clientNameElements = document.querySelectorAll(
		'.client-name-placeholder'
	)

	operatorNameElements.forEach(element => {
		if (element.classList.contains('operator-name-placeholder')) {
			element.innerHTML = `<span style="color: blue;">${operatorName}</span>`
		}
	})

	clientNameElements.forEach(element => {
		if (element.classList.contains('client-name-placeholder')) {
			element.innerHTML = `<span style="color: blue;">${clientName}</span>`
		}
	})
}

// Функция для определения следующего вопроса на основе ответа пользователя
function getNextQuestionIndex(currentIndex, userAnswer) {
	const currentQuestion = questions[currentIndex]

	// Проверяем, есть ли условия для данного ответа
	if (currentQuestion.conditions && currentQuestion.conditions[userAnswer]) {
		return currentIndex + currentQuestion.conditions[userAnswer]
	}

	// Если условий нет, возвращаем индекс следующего вопроса по умолчанию
	return currentIndex + 1
}

// Массив для хранения ответов
const answers = []

let currentIndex = 0

// Функция для отображения вопросов
function showQuestions() {
	const currentQuestion = questions[currentIndex]
	const questionRow = document.createElement('tr')
	questionRow.innerHTML = `
        <td>${currentQuestion.topic}</td>
        <td>${currentQuestion.phrase}</td>
        <td></td>
    `

	const radioGroup = document.createElement('div')
	currentQuestion.options.forEach((option, optionIndex) => {
		const radioInput = document.createElement('input')
		radioInput.type = 'radio'
		radioInput.id = `question${currentIndex}_option${optionIndex}`
		radioInput.name = `question${currentIndex}`
		radioInput.value = option

		const radioLabel = document.createElement('label')
		radioLabel.htmlFor = `question${currentIndex}_option${optionIndex}`
		radioLabel.innerText = option

		radioGroup.appendChild(radioInput)
		radioGroup.appendChild(radioLabel)

		radioInput.addEventListener('change', () => {
			answers[currentIndex] = option
			currentIndex = getNextQuestionIndex(currentIndex, option) // Определяем следующий вопрос
			showQuestions()
		})

		if (answers[currentIndex] === option) {
			radioInput.checked = true
		}
	})

	questionRow.querySelector('td:last-child').appendChild(radioGroup)
	tableBody.appendChild(questionRow)

	// Вызов функции для обновления имен оператора и клиента
	updateNamesInQuestions()
}

// Событие при клике на кнопку "Сохранить" в модальном окне
saveButton.addEventListener('click', () => {
	operatorName = operatorNameInput.value
	clientName = clientNameInput.value

	updateNamesInQuestions() // Обновляем текст фраз с именами оператора и клиента в вопросах

	modal.style.display = 'none'
	mainPage.style.display = 'block'

	showQuestions()
})

modal.style.display = 'block'
mainPage.style.display = 'none'
