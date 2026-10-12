const form = document.querySelector("#bet-form");
const submitButton = document.querySelector("#submit-button");
const buttonLabel = submitButton.querySelector(".button-label");
const spinner = submitButton.querySelector(".spinner");
const errorBox = document.querySelector("#form-error");
const apiUrlInput = document.querySelector("#api-url");
const configMessage = document.querySelector("#config-message");
const resultStatus = document.querySelector("#result-status");
const emptyResult = document.querySelector("#empty-result");
const resultContent = document.querySelector("#result-content");

const API_STORAGE_KEY = "jungleGamingApiUrl";
const savedApiUrl = localStorage.getItem(API_STORAGE_KEY);
if (savedApiUrl) apiUrlInput.value = savedApiUrl;

function makeId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function generateIds() {
  const id = makeId("bet");
  document.querySelector("#externalTransactionId").value = id;
  document.querySelector("#idempotencyKey").value = id;
}

generateIds();

document.querySelector("#new-id-button").addEventListener("click", generateIds);

document.querySelector("#save-config").addEventListener("click", () => {
  const value = apiUrlInput.value.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Protocolo inválido");
    apiUrlInput.value = value;
    localStorage.setItem(API_STORAGE_KEY, value);
    configMessage.textContent = "Endereço salvo neste navegador.";
    configMessage.style.color = "var(--success)";
  } catch {
    configMessage.textContent = "Informe uma URL válida, como http://localhost:3000.";
    configMessage.style.color = "var(--danger)";
  }
});

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  buttonLabel.textContent = isLoading ? "Enviando..." : "Enviar aposta";
  spinner.classList.toggle("hidden", !isLoading);
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function firstUsefulMessage(data, fallback) {
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.message)) return data.message.join(" ");
  if (typeof data?.error === "string") return data.error;
  return fallback;
}

function showResult(data, httpStatus) {
  emptyResult.classList.add("hidden");
  resultContent.classList.remove("hidden");

  const status = String(data?.status ?? "SEM STATUS");
  document.querySelector("#result-transaction-id").textContent = data?.transactionId ?? data?.id ?? "Não informado";
  document.querySelector("#result-transaction-status").textContent = status;
  document.querySelector("#result-replayed").textContent =
    data?.replayed === true || data?.idempotentReplay === true ? "Sim" :
    data?.replayed === false || data?.idempotentReplay === false ? "Não" : "Não informado";
  document.querySelector("#result-message").textContent = data?.message ?? (httpStatus >= 200 && httpStatus < 300 ? "Requisição concluída." : "A API retornou um erro.");
  document.querySelector("#result-balance").textContent =
    data?.balance !== undefined && data?.balance !== null ? formatBalance(data.balance) : "Não informado";
  document.querySelector("#raw-json").textContent = JSON.stringify(data, null, 2);

  resultStatus.textContent = status;
  resultStatus.className = "status-label " + (
    httpStatus >= 200 && httpStatus < 300 && status === "PROCESSED" ? "status-success" :
    httpStatus >= 400 || status === "REJECTED" || status === "FAILED" ? "status-error" :
    "status-neutral"
  );
}

function formatBalance(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(number);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  const apiBase = apiUrlInput.value.trim().replace(/\/+$/, "");
  let parsedUrl;
  try {
    parsedUrl = new URL(apiBase);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    showError("Informe uma URL válida para a API no painel de conexão.");
    return;
  }

  const values = new FormData(form);
  const amountText = String(values.get("amount") ?? "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(amountText) || Number(amountText) <= 0) {
    showError("Informe um valor maior que zero, com no máximo duas casas decimais.");
    return;
  }

  const currency = String(values.get("currency") ?? "").trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    showError("A moeda deve ter exatamente três letras, por exemplo BRL.");
    return;
  }

  const idempotencyKey = String(values.get("idempotencyKey") ?? "").trim();
  const externalTransactionId = String(values.get("externalTransactionId") ?? "").trim();
  if (!idempotencyKey || !externalTransactionId) {
    showError("Preencha a chave de idempotência e o ID externo da transação.");
    return;
  }

  // Contrato alinhado ao endpoint atual do backend; não enviamos saldo nem tipo,
  // pois o serviço atual processa BET e determina o estado no servidor.
  const payload = {
    providerId: String(values.get("providerId")).trim(),
    externalTransactionId,
    playerId: String(values.get("playerId")).trim(),
    currency,
    amount: Number(amountText).toFixed(2),
    roundId: String(values.get("roundId")).trim(),
    gameId: String(values.get("gameId")).trim()
  };

  if (Object.values(payload).some((value) => value === "")) {
    showError("Preencha todos os campos obrigatórios.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${apiBase}/wagering/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { message: rawText || "A API retornou uma resposta vazia." };
    }

    showResult(data, response.status);

    if (!response.ok) {
      const fallback = response.status === 409
        ? "Conflito: a transação já existe com dados diferentes."
        : `A API retornou HTTP ${response.status}.`;
      showError(firstUsefulMessage(data, fallback));
    }
  } catch (error) {
    showError("Não foi possível conectar à API. Verifique se o backend está rodando, se a URL está correta e se o CORS permite esta origem.");
    resultStatus.textContent = "Sem conexão";
    resultStatus.className = "status-label status-error";
    emptyResult.classList.remove("hidden");
    resultContent.classList.add("hidden");
  } finally {
    setLoading(false);
  }
});
