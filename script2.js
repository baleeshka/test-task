const modal = document.getElementById('modal')
const operatorNameInput = document.getElementById('operatorName')
const clientNameInput = document.getElementById('clientName')
const saveButton = document.getElementById('saveButton')
const mainPage = document.getElementById('main-page')
const tabs = document.querySelectorAll('.tab-button')
const tableBody = document.querySelector('#interactive-table tbody')

let currentQuestionIndex = 0
let operatorName = ''
let clientName = ''

// Объявляем массив с вопросами и ответами
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

// ...

// Событие при клике на кнопку "Сохранить" в модальном окне
saveButton.addEventListener('click', () => {
	operatorName = operatorNameInput.value
	clientName = clientNameInput.value

	// Скрываем модальное окно и отображаем главную страницу
	modal.style.display = 'none'
	mainPage.style.display = 'block'

	// Начинаем отображение вопросов, передавая имена оператора и клиента
	showNextQuestion(operatorName, clientName)
})

function showNextQuestion(operatorName, clientName) {
	if (currentQuestionIndex < questions.length) {
		// Получаем текущий вопрос
		const currentQuestion = questions[currentQuestionIndex]

		// Обновляем фразу с учетом имени оператора и клиента
		const phraseWithNames = currentQuestion.phrase
			.replace('${operatorName}', operatorName)
			.replace('${clientName}', clientName)

		// Создаем строку таблицы для вопроса
		const row = document.createElement('tr')
		row.innerHTML = `
			<td>${currentQuestion.topic}</td>
			<td>${phraseWithNames}</td>
			<td>
				<input type="radio" id="option${currentQuestionIndex}-1" name="answer${currentQuestionIndex}" value="${currentQuestion.options[0]}">
				<label for="option${currentQuestionIndex}-1">${currentQuestion.options[0]}</label><br>
				<input type="radio" id="option${currentQuestionIndex}-2" name="answer${currentQuestionIndex}" value="${currentQuestion.options[1]}">
				<label for="option${currentQuestionIndex}-2">${currentQuestion.options[1]}</label><br>
			</td>
		`

		tableBody.appendChild(row)

		// Добавьте обработчики событий для радио-кнопок текущего вопроса
		const radioButtons = document.querySelectorAll(
			`input[name="answer${currentQuestionIndex}"]`
		)
		radioButtons.forEach(radioButton => {
			radioButton.addEventListener('change', handleRadioButtonChange)
		})
	} else {
		// Все вопросы отображены, выполните какие-либо действия или перейдите к следующему этапу вашего приложения.
	}
}

function handleRadioButtonChange(event) {
	// Обновляем выбранный ответ в объекте вопроса
	const selectedAnswer = event.target.value
	questions[currentQuestionIndex].selectedAnswer = selectedAnswer

	// Убираем обработчики событий радио-кнопок текущего вопроса
	const radioButtons = document.querySelectorAll(
		`input[name="answer${currentQuestionIndex}"]`
	)
	radioButtons.forEach(radioButton => {
		radioButton.removeEventListener('change', handleRadioButtonChange)
	})

	// Увеличиваем индекс текущего вопроса
	currentQuestionIndex++

	// Показываем следующий вопрос
	showNextQuestion()
}

// События при переключении разделов
tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		// Делаем активным выбранный раздел
		tabs.forEach(t => t.classList.remove('active'))
		tab.classList.add('active')

		// Определяем выбранный раздел
		const section = tab.getAttribute('data-section')

		// Получаем контейнер для раздела "main-page"
		const mainPage = document.getElementById('main-page')
		if (section === 'presentation') {
			// Показываем контент раздела "Представление"
			// Скрываем остальные разделы
			mainPage.style.display = 'block'
		} else if (section === 'successful-call') {
			// Ваш код для открытия этого раздела

			// Очищаем содержимое контейнера main-page
			mainPage.innerHTML = ''

			// Создаем контейнер для раздела "Дозвон, Успешно"
			const successfulCallSection = document.createElement('div')
			successfulCallSection.id = 'successful-call-section'

			// Создаем радио-кнопки
			const paidServiceRadio = document.createElement('label')
			paidServiceRadio.innerHTML = `
				<input type="radio" name="serviceType" value="Платная"> Подключение ПЛАТНОЙ услуги
			`

			const freeServiceRadio = document.createElement('label')
			freeServiceRadio.innerHTML = `
				<input type="radio" name="serviceType" value="Бесплатная"> Подключение Бесплатной услуги
			`

			// Создаем кнопку "Завершить работу с заданием"
			const finishButton = document.createElement('button')
			finishButton.id = 'finishButton'
			finishButton.style.backgroundColor = 'blue'
			finishButton.style.color = 'white'
			finishButton.textContent = 'Завершить работу с заданием'

			// Добавляем радио-кнопки и кнопку в контейнер "Дозвон, Успешно"
			successfulCallSection.appendChild(paidServiceRadio)
			successfulCallSection.appendChild(document.createElement('br')) // Добавляем перенос строки
			successfulCallSection.appendChild(freeServiceRadio)
			successfulCallSection.appendChild(document.createElement('br')) // Добавляем еще один перенос строки
			successfulCallSection.appendChild(finishButton)

			// Вставляем контейнер "Дозвон, Успешно" внутрь контейнера main-page
			mainPage.appendChild(successfulCallSection)

			// Отображаем контейнер main-page
			mainPage.style.display = 'block'
		} else if (section === 'rejected-call') {
			// Показываем контент раздела "Дозвон, Отказ"
			// Скрываем остальные разделы
			mainPage.style.display = 'none'
		} else if (section === 'missed-call') {
			// Показываем контент раздела "Недозвон"
			// Скрываем остальные разделы
			mainPage.style.display = 'none'
		} else if (section === 'callback') {
			// Показываем контент раздела "Перезвон"
			// Скрываем остальные разделы
			mainPage.style.display = 'none'
		} else if (section === 'telephony-error') {
			// Показываем контент раздела "Ошибка телефонии"
			// Скрываем остальные разделы
			mainPage.style.display = 'none'
		}
	})
})

// Открываем модальное окно при загрузке страницы
modal.style.display = 'block'
mainPage.style.display = 'none'
