import { showMessage } from "./showMessage.js";

export function controlExpenses() {
  /*==========Variables Globales==========*/
  const form = document.querySelector("#form");
  const formModal = document.querySelector("#form-modal-budget");
  const listExpense = document.querySelector("#list-expense");
  let budgetArray;

  /*==========Eventos==========*/
  eventListener();
  function eventListener() {
    form.addEventListener("submit", getExpense);
    formModal.addEventListener("submit", getBudget);
  }

  /*==========Clases==========*/
  class Budget {
    constructor(budget) {
      // Presupuesto
      this.budget = Number(budget);
      // Restante
      this.remaining = Number(budget);
      // Gastos
      this.expenses = [];
    }

    // nuevo Gasto
    newExpense(expenseObj) {
      // añadiendo los gastos al array "expenses" de la clase Budget
      this.expenses = [...this.expenses, expenseObj];
      // Calcular Presupuesto
      this.calculateBudget();
    }

    // Calcular Presupuesto
    calculateBudget() {
      // reduce nos suma los gastos que el usuario va ingresando
      const spent = this.expenses.reduce(
        (total, expense) => total + expense.quantity,
        0
      );
      // Restando los gastos al dinero restante
      this.remaining = this.budget - spent;
    }

    // Eliminar un gasto
    deleteExpense(id) {
      // con el metodo "filter", obtenemos todos los gastos excepto el gasto el cual el usuario quiere elimar
      this.expenses = this.expenses.filter((expense) => expense.id !== id);

      // Volvermos a calcular el presupuesto
      this.calculateBudget();
    }
  }

  // Clase User Interface
  class UI {
    // Agregar un presupuesto
    addBudget(quantityBudget) {
      // Variables
      const { budget, remaining } = quantityBudget;
      const modalBudget = document.querySelector("#modal");
      const modal = bootstrap.Modal.getInstance(modalBudget);

      // agregar el presupuesto
      document.querySelector("#budget").textContent = budget;
      document.querySelector("#remaining-money").textContent = remaining;

      // Cerrar modal
      modal.hide();
      // Reiniciar formulario
      formModal.reset();
    }

    // Mostrar los gastos ingresados por el usuario en el HTML
    viewExpenses(budgetArray) {
      // Limpiar HTML anterior
      cleanHTML();

      // Recoremos el areglo
      budgetArray.forEach((budget) => {
        // Destructuring
        const { expense, quantity, id } = budget;

        // Creando HTMl
        const tr = document.createElement("tr");
        const tdExpense = document.createElement("td");
        const tdQuantity = document.createElement("td");

        // Boton Eliminar
        const tdButton = document.createElement("td");
        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn", "btn-danger");
        btnDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
      </svg>`;

        // Agregando el botón
        tdButton.appendChild(btnDelete);

        // añadiendo contenido
        tdExpense.textContent = expense;
        tdQuantity.textContent = `Q${quantity}`;

        // Obteniendo el id de cada gasto
        listExpense.dataset.id = id;

        // Evento para el boton eliminar
        btnDelete.onclick = () => {
          // Eliminar gastos
          deleteExpense(id);
        };

        // añadiendo al HTML
        tr.appendChild(tdExpense);
        tr.appendChild(tdQuantity);
        tr.appendChild(tdButton);
        listExpense.appendChild(tr);
      });

      function cleanHTML() {
        /* Eliminando el HTML previo */
        while (listExpense.firstChild) {
          /*Eliminando el primer hijo de cada elemento */
          listExpense.removeChild(listExpense.firstChild);
        }
      }
    }

    // Actualizando el restante cuando se elimina un gasto
    updateRemaining(remaining) {
      document.querySelector("#remaining-money").textContent = remaining;
    }

    // Cambio de fondo de color del elemento restante en función del porcentaje gastado por el usuario
    checkRemaining(budgetArray) {
      const { budget, remaining } = budgetArray;
      const remainingMoney = document.querySelector("#remaining");

      // Gasto mas del 75%
      if (budget / 4 > remaining) {
        remainingMoney.classList.remove("alert-success", "alert-warning");
        remainingMoney.classList.add("alert-danger");
      } // Gasto mas del 50%
      else if (budget / 2 > remaining) {
        remainingMoney.classList.remove("alert-success", "alert-danger");
        remainingMoney.classList.add("alert-warning");
      } else {
        remainingMoney.classList.remove("alert-danger", "alert-warning");
        remainingMoney.classList.add("alert-success");
      }

      // Comprobar si el presupuesto se ha superado
      if (remaining <= 0) {
        showMessage("Ups su presupuesto se ha agotado", "error");
        // Deshabilitando el boton para agregar gastos
        form.querySelector('button[type = "submit"]').disabled = true;
      } else {
        // habilitando el boton para agregar gastos
        form.querySelector('button[type = "submit"]').disabled = false;
      }
    }
  }

  //Iniciando la clase UI
  const ui = new UI();

  /*==========Funciones==========*/

  // Obtener presupuesto
  function getBudget(e) {
    e.preventDefault();

    // Obtener el valor del formulario almacenado en el modal
    const quantityBudget = document.querySelector("#quantity-budget").value;

    // Validar
    if (quantityBudget === "") {
      showMessage("El campo está vacío", "error");
      return;
    } else if (quantityBudget <= 0) {
      showMessage("La cantidad debe ser superior a 0", "error");
      return;
    }

    // Creando un nuevo objeto
    budgetArray = new Budget(quantityBudget);

    // Agregar Presupuesto obtenido
    ui.addBudget(budgetArray);
  }

  // Obtener Gastos
  function getExpense(e) {
    e.preventDefault();
    // variables
    const expense = document.querySelector("#expense").value;
    const quantity = Number(document.querySelector("#quantity").value);

    // validar inputs
    if (expense === "" || quantity === "") {
      showMessage("Todos los campos son obligatorios", "error");
      return;
    } else if (quantity <= 0 || isNaN(quantity)) {
      showMessage("La cantidad debe ser superior a 0", "error");
      return;
    }

    // Objeto de gastos
    const expenseObj = { expense, quantity, id: Date.now() };

    // Añadir el objeto "expenseObj" al array "expenses" de la clase Budget
    budgetArray.newExpense(expenseObj);

    // Mostrar los gasto en el HTML
    const { expenses, remaining } = budgetArray;
    // Añadir los gastos al HTML
    ui.viewExpenses(expenses);

    // Mostrar alerta
    showMessage("Gasto agregado correctamente :)", "success");

    // reiniciar formulario
    form.reset();

    // Actualizamos el restante cuando el usuario elimine un gasto
    ui.updateRemaining(remaining);

    // Cambiamos el color de la etiqueta que contiene el restante en función del porcentaje gastado por el usuario.
    ui.checkRemaining(budgetArray);
  }

  // Eliminar Gasto
  function deleteExpense(id) {
    // Funcion de la clase Budget
    budgetArray.deleteExpense(id);

    // Elimina los gastos del HTML
    const { expenses, remaining } = budgetArray;

    // Cuando se elimine un gasto volvemos a llamar estas funciones
    ui.viewExpenses(expenses);
    ui.updateRemaining(remaining);
    ui.checkRemaining(budgetArray);
  }
}
