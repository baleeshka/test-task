const questionContainer = document.getElementById('question-container')
const resultContainer = document.getElementById('result-container')
const questionElement = document.getElementById('question')
const option1Button = document.getElementById('option1')
const option2Button = document.getElementById('option2')
const resultElement = document.getElementById('result')

// Создайте объект с вопросами и вариантами ответов
const questions = [
	{
		question:
			'<div>Перед работой с клиентом, откройте актуальную версию:<br>' +
			'- <b>Инструкцию по закрытию задач</b><br>' +
			'- <b>[Интерактив]&laquo;РСВ&raquo;НС1/НС2</b><br>' +
			'<br>' +
			'Удалось дозвониться?</div>',
		options: [
			{
				text: 'Да',
				nextQuestion: 1, // Индекс следующего вопроса в массиве
			},
			{
				text: 'Нет',
				nextQuestion: -4,
			},
		],
	},
	{
		question:
			'Здравствуйте, меня зовут <span style="color: blue;"><Имя></span>, я <span style="font-weight: bold; color: red;">Представляю Тинькофф</span>. Я разговариваю с <span style="color: blue;"><ИО></span>?',
		options: [
			{
				text: 'Да',
				nextQuestion: 2,
			},
			{
				text: 'Нет',
				nextQuestion: 7,
			},
		],
	},
	{
		question:
			'Очень приятно, <span style="color: blue;"><ИО></span>. Вы готовы уделить мне 2-3 минуты Вашего внимания и ответить на пару вопросов?',
		options: [
			{
				text: 'Да',
				nextQuestion: 3,
			},
			{
				text: 'Нет',
				nextQuestion: 9,
			},
		],
	},
	{
		question:
			'<span style="color: blue;"><ИО></span>, спасибо, что вы являетесь нашим клиентом. Позвольте сообщить, что мы подключаем Клиентам особую программу страхования, которая обеспечит Вам надёжную финансовую защиту при потере трудоспособности в результате несчастного случая, а также от потери работы.<br>' +
			'При наступлении страхового случая по рискам "Уход из жизни" в результате НС и "Инвалидность 1, 2 группы" в результате НС, размер страховой выплаты составит 160% от задолженности на дату наступления страхового случая. Например: если задолженность составляла 100 000 рублей, то страховая выплата составить 160 000 рублей.<br>' +
			'<br>' +
			'При наступлении страхового случая по риску "Потеря работы", задолженность в пределах 120 000 рублей будет погашена за счёт страховой компании.<br>' +
			'Скажите, вы готовы защитить себя от непредвиденных жизненных ситуаций?',
		options: [
			{
				text: 'Да',
				nextQuestion: 4,
			},
			{
				text: 'Отказ',
				nextQuestion: -1,
			},
		],
	},
	{
		question:
			'<span style="color: blue;"><ИО></span>, плата за услугу составляет всего 0,89% от суммы задолженности, на момент формирования счет-выписки. Например, в случае наличия задолженности в 1000 рублей плата за программу будет составлять всего 8 рублей 90 копеек в месяц. При этом, в случае, если задолженность отсутствует, то плата за программу не взимается.<br>' +
			'Согласитесь, это выгодное предложение?<br>' +
			'<br>' +
			'<b>ВАЖНО! Если клиент не согласен по критерию цены предлагай льготную программу</b>. <br>' +
			'<br>' +
			'<span style="color: blue;"><ИО></span>, в таком случае, я могу предложить вам эту де страховую программу, но на льготных условиях:<br>' +
			'В течение 90 дней после подключения плата за услугу &laquo;Страхование задолженности&raquo; не будет списываться, и Вы сможете оценить все достоинства услуги совершенно бесплатно. В дальнейшем плата за нее составит всего 0,89% от суммы задолженности.',
		options: [
			{
				text: 'Да',
				nextQuestion: 5,
			},
			{
				text: 'Отказ',
				nextQuestion: -1,
			},
		],
	},
	{
		question:
			'Обращаю ваше внимание на то, что участниками программы не могут быть лица, старше 75 лет и страдающие психическими заболеваниями.<br>' +
			'С этими условиями согласны?',
		options: [
			{
				text: 'Да',
				nextQuestion: 6,
			},
			{
				text: 'Отказ',
				nextQuestion: -1,
			},
		],
	},
	{
		question:
			'<b>В таком случае вы будете застрахованы от рисков получения инвалидности 1, 2 группы в результате НС, ухода из жизни в результате НС, а так же от потери работы. <span style="color: red;">Инвалидность в результате болезни в покрытие не входит.</span><br>' +
			'<br>' +
			'Скажите, Вы согласны стать участником этой программы?<br>' +
			'<br>' +
			'ВАЖНО!</b> Если клиент сообщает, что ему ранее была присвоена группа инвалидности, то необходимо пояснить, что в этом случае программа будет покрывать только риск уход из жизни в результате НС.',
		options: [
			{
				text: 'Да',
				nextQuestion: -2,
			},
			{
				text: 'Отказ',
				nextQuestion: -1,
			},
		],
	},
	{
		question: 'Скажите, вы знакомы с <span style="color: blue;"><ФИО></span>?',
		options: [
			{
				text: 'Да',
				nextQuestion: 8,
			},
			{
				text: 'Нет',
				nextQuestion: -5,
			},
		],
	},
	{
		question:
			'Подскажите, когда можно будет перезвонить, чтобы поговорить с <span style="color: blue;"><ИО></span>?',
		options: [
			{
				text: 'Сообщает время',
				nextQuestion: -3,
			},
			{
				text: 'Не сообщает время',
				nextQuestion: -3,
			},
		],
	},
	// Добавьте больше вопросов и вариантов ответов по мере необходимости
]

let currentQuestionIndex = 0

// Функция для обновления вопроса и вариантов ответов
// Функция для обновления вопроса и вариантов ответов
function showQuestion(questionIndex) {
	const currentQuestion = questions[questionIndex]
	questionElement.innerHTML = currentQuestion.question

	// Удалите старые варианты ответов
	while (option1Button.firstChild) {
		option1Button.removeChild(option1Button.firstChild)
	}
	while (option2Button.firstChild) {
		option2Button.removeChild(option2Button.firstChild)
	}

	// Добавьте новые варианты ответов
	currentQuestion.options.forEach((option, index) => {
		const optionButton = document.createElement('button')
		optionButton.innerHTML = option.text // Используйте innerHTML для вставки HTML-разметки
		optionButton.addEventListener('click', () => {
			handleOptionClick(option.nextQuestion)
		})
		if (index === 0) {
			option1Button.appendChild(optionButton)
		} else {
			option2Button.appendChild(optionButton)
		}
	})
}
function showText(text) {
	const textElement = document.getElementById('question') // Получаем элемент, куда нужно вставить текст (может быть другой элемент)

	// Проверяем, что элемент существует
	if (textElement) {
		textElement.innerHTML = text // Вставляем текст в элемент, используя innerHTML
	}
}

function showFinalText1() {
	const finalText =
		'<span style="color: red;">Проведи РСВ согласно процедуре.</span>.<br>' +
		'<br>' +
		'Если работы с возражениями проведена и клиент всё равно отказался, то:<br>' +
		'1) Сообщить: <span style="color: blue;">И.О</span>, Благодарю вас за уделённое время. Если возникнет желание подключить услугу страхования жизни, можете это сделать в мобильном приложении или на сайте www.tinkoff.ru <br>' +
		'<br>' +
		'2) Перейти во вкладку &laquo;<span style="color: blue;">Отказ</span>&raquo;, закрыть задачу согласно соответствующей инструкции.'
	showText(finalText) // Показываем финальный текст
	document.getElementById('options').style.display = 'none' // Скрываем блок с вариантами ответов
}

function showFinalText2() {
	const finalText =
		'Плата за страхование будет списываться с вашей карты ежемесячно. Программа начнёт действовать с момента формирования следующей счёт-выписки. В случае нежелания далее получать страховую защиту, вы можете в любое время отключить её в мобильном приложении или в личном кабинете на сайте www.tinkoff.ru. Благодарю вас. Услуга страхования успешно подключена. Всего доброго, до свидания.<br>' +
		'<br>' +
		'Перейти в &laquo;<span style="color: blue;">Дозвон-Успешно</span>&raquo; Работаем согласно инструкции по закрытию задач'
	showText(finalText) // Показываем финальный текст
	document.getElementById('options').style.display = 'none' // Скрываем блок с вариантами ответов
}
function showFinalText3() {
	const finalText =
		'Перейти во вкладку &laquo;<span style="color: blue;">Перезвон</span>&raquo; Работаем согласно инструкции по закрытию  задач.'
	showText(finalText) // Показываем финальный текст
	document.getElementById('options').style.display = 'none' // Скрываем блок с вариантами ответов
}
function showFinalText4() {
	const finalText =
		'Перейти в раздел &laquo;<span style="color: blue;">Недозвон</span>&raquo; Работаем согласно инструкции по закрытию  задач.'
	showText(finalText) // Показываем финальный текст
	document.getElementById('options').style.display = 'none' // Скрываем блок с вариантами ответов
}
function showFinalText5() {
	const finalText =
		'Приношу извинения. Всего доброго!<br>' +
		'<br>' +
		'Перейти в раздел &laquo;<span style="color: blue;">Отказ</span>&raquo; Работаем согласно инструкции по закрытию  задач.'
	showText(finalText) // Показываем финальный текст
	document.getElementById('options').style.display = 'none' // Скрываем блок с вариантами ответов
}

// Функция для обработки выбора пользователя
function handleOptionClick(nextQuestionIndex) {
	const currentQuestion = questions[currentQuestionIndex]

	if (nextQuestionIndex === -1) {
		showFinalText1()
	} else if (nextQuestionIndex === -2) {
		showFinalText2()
	} else if (nextQuestionIndex === -3) {
		showFinalText3()
	} else if (nextQuestionIndex === -4) {
		showFinalText4()
	} else if (nextQuestionIndex === -5) {
		showFinalText5()
	} else {
		// Перейдите к следующему вопросу
		currentQuestionIndex = nextQuestionIndex
		showQuestion(currentQuestionIndex)
	}
}

// Начните с отображения первого вопроса
showQuestion(currentQuestionIndex)
