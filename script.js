// Seleciona os elementos do formulario
const form = document.querySelector("form")
const amout = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista 
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")


// Capturando o evento de input para formatar o valor.
amout.oninput = ()  => {
  // Obtem o valor atual do input e remove os caracteres nao numericos. 
  let value = amount.value.replace(/\D/g, "")

  //Transformar o valor em centavos (ex: 150/100 = 1.5 que é equivalente a R$ 1,50)
  value = Number(value) / 100

  //atualiza o valor do input
  amount.value = formatCurrencyBRL(value)

}

function formatCurrencyBRL(value){
  // Formata o valor no padrao BRL(real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency:"brl",
  })

  return value
}


// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrao de recarregar a pagina
  event.preventDefault()
  // Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),

    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  }

  // chama a funcao que ira adicionar o item na lista
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense){
  try{
    // Cria o elemento para adicionar o item(li) na lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    

    // Cria o icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src",`img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt",newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement ("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona name e category na div das informacoes da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src","img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    // Adiciona as informacoes no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o item na lista
    expenseList.append(expenseItem)
    formClear()

    // Limpa o formulario para add um novo item

    // Atualiza os totais
    updateTotals()

  } catch(error) {
    alert("Nao foi possivel atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualina os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children
    
    // Atualiza a quantidade de itens na lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`

    // Variavel para incrementar o total
    let total = 0
    // Percorre cada item (li) da lista (ul) 
    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount")

      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace("," , ".")

    // Converte o valor para float
    value = parseFloat(value)

    // Verifica se é um numero valido
    if (isNaN(value)){
      return alert("Nao foi possivel calcular o total. O valor nao parece ser um numero.")

    }

    // Incrementa o valor total
    total += Number(value)
      
    }

    // Cria a span para adiconar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$" , "")

    // Limpa o conteudo do elemento
    expensesTotal.innerHTML = ""

    // Adiciona o simbolo da moeda e o valor total formatado 
    expensesTotal.append(symbolBRL, total)

  }catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais.")
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event) {

 // Verifica se o elemento clicado é o icone de remover.
  if (event.target.classList.contains("remove-icon")){
    
    // Obtem a li pai do elemento clicado.
    const item = event.target.closest(".expense")
    
    // Remove o item da lista
    item.remove()
  }

  // Atualiza o total
  updateTotals()
})


function formClear(){
  // Limpa os inputs
  expense.value = ""
  category.value = ""
  amout.value = ""

  //  Coloca o foco no input de amount
  expense.focus()
}
