/**
 * Практическая работа: HTTP-запросы с использованием Fetch API
 * Студент: Караблин И.А., Фаминский Н.К.
 * Группа: ПР-24.101
 * 
 * Данный скрипт демонстрирует работу с различными типами HTTP-запросов:
 * - GET: получение данных с сервера
 * - POST: отправка данных на сервер (создание нового ресурса)
 */

// Получаем ссылку на DOM-элемент, куда будем выводить результаты
const resultDiv = document.getElementById("result");

/**
 * Функция для выполнения GET-запроса и получения всех постов
 * async - означает, что функция асинхронная и возвращает Promise
 * await - приостанавливает выполнение функции до получения ответа
 */
async function getAllPosts() {
    // Показываем индикатор загрузки
    resultDiv.innerHTML = 
        '<p class="text-center text-gray-500 animate-pulse">Загрузка постов...</p>';

    try {
        // Выполняем GET-запрос к API JSONPlaceholder
        // fetch - встроенная функция браузера для выполнения HTTP-запросов
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        
        // Проверяем статус ответа
        // ok = true для статусов 200-299, false для 400-599
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        // Преобразуем ответ в JSON (это тоже асинхронная операция)
        const posts = await res.json();
        
        // Начинаем формировать HTML для вывода
        let html = `<h3 class="text-xl font-bold mb-4">Получено ${posts.length} постов (показываем первые 10)</h3>`;
        
        // Проходим по первым 10 постам и создаем для них HTML-разметку
        // slice(0, 10) - берем элементы с 0 по 9 индекс
        posts.slice(0, 10).forEach((post) => {
            // Используем шаблонные строки (обратные кавычки) для вставки данных
            html += `
                <div class="mb-6 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <h4 class="text-lg font-semibold mb-2">${post.title}</h4>
                    <p class="text-gray-700 dark:text-gray-300">${post.body}</p>
                    <div class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        UserId: ${post.userId} • postId: ${post.id}
                    </div>
                </div>
            `;
        });
        
        // Вставляем сформированный HTML в элемент resultDiv
        resultDiv.innerHTML = html;
    } catch (err) {
        // Если произошла ошибка, показываем сообщение об ошибке
        resultDiv.innerHTML = `
            <p class="text-red-600 font-medium">Ошибка: ${err.message}</p>
            <p class="text-sm text-gray-500 mt-2">Проверьте консоль (F12) для деталей</p>
        `;
        // Выводим ошибку в консоль для отладки
        console.error(err);
    }
}

/**
 * Функция для получения конкретного поста по ID (пост №5)
 */
async function getPost5() {
    // Показываем индикатор загрузки
    resultDiv.innerHTML = `
        <p class="text-center text-gray-500 animate-pulse">Загрузка поста №5...</p>`;

    try {
        // Выполняем GET-запрос к конкретному посту
        // /posts/5 - запрос конкретного ресурса по ID
        const res = await fetch("https://jsonplaceholder.typicode.com/posts/5");
        
        // Проверяем успешность запроса
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Парсим ответ
        const post = await res.json();

        // Формируем и выводим результат
        resultDiv.innerHTML = `
            <h3 class="text-xl font-bold mb-4">Пост №5</h3>
            <div class="p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                <h4 class="text-lg font-semibold mb-2">${post.title}</h4>
                <p class="text-gray-700 dark:text-gray-300">${post.body}</p>
                <div class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    userID: ${post.userId} • postID: ${post.id}
                </div>
            </div>
        `;
    } catch (err) {
        // Обработка ошибок
        resultDiv.innerHTML = `<p class="text-red-600 font-medium">Ошибка: ${err.message}</p>`;
        console.error(err);
    }
}

/**
 * Функция для создания нового поста через POST-запрос
 */
async function createPost() {
    // Получаем ссылки на поля ввода
    const titleEl = document.getElementById("title");
    const bodyEl = document.getElementById("body");

    // Получаем значения из полей ввода
    // trim() - удаляет пробелы в начале и конце строки
    // Если поле пустое, используем значения по умолчанию
    const title = titleEl.value.trim() || "Тестовый заголовок";
    const body = bodyEl.value.trim() || "Тестовый текст поста";

    // Показываем индикатор отправки
    resultDiv.innerHTML = 
        `<p class="text-center text-gray-500 animate-pulse">Отправка POST-запроса...</p>`;

    try {
        // Выполняем POST-запрос
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST", // Указываем метод HTTP
            headers: { 
                "Content-Type": "application/json" // Говорим серверу, что отправляем JSON
            },
            // Преобразуем объект в JSON-строку
            body: JSON.stringify({ 
                title,      // ключ title и значение из переменной title
                body,       // ключ body и значение из переменной body
                userId: 777 // произвольный ID пользователя
            })
        });

        // Парсим ответ сервера
        const data = await res.json();

        // Выводим результат
        resultDiv.innerHTML = `
            <h3 class="text-xl font-bold mb-4 text-green-600">POST-запрос успешен!</h3>
            <div class="p-5 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p><strong>Статус:</strong> ${res.status} ${res.ok ? "(OK)" : ""}</p>
                <p><strong>Новый id (симуляция):</strong> ${data.id}</p>
                <p><strong>Заголовок:</strong> ${data.title}</p>
                <p class="mt-3 text-sm text-gray-500">Тело: ${data.body.substring(0, 120)}...</p>
            </div>
        `;
    } catch (err) {
        // Обработка ошибок
        resultDiv.innerHTML = `<p class="text-red-600 font-medium">Ошибка при создании поста: ${err.message}</p>`;
        console.error(err);
    }
}

// Примечание: функции не вызываются здесь автоматически
// Они будут вызваны при нажатии на соответствующие кнопки в HTML