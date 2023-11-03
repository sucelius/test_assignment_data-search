<script setup lang="ts">
import { vMaska } from "maska";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { reactive, ref } from "vue";

const schema = yup.object({
  email: yup.string().email().required(),
});

const emailUserInput = ref({
  email: "",
});

const dataFromServer = ref({
  email: "",
  number: "",
});

const numberMaskedValues = reactive({
  masked: "",
  unmasked: "",
  completed: false,
});

const timerValue = ref(5);
const showTimer = ref(false);

let pending = ref(false);
let abortController: any;

async function onSubmit() {
  abortController = new AbortController();
  removeOldServerData();

  if (!showTimer.value) {
    showTimer.value = true;
  }

  let countdown = startCountdown();

  if (pending.value) {
    abortController.abort();
  }
  pending.value = true;

  try {
    const response = await fetch("http://localhost:8000/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
      body: JSON.stringify({
        email: emailUserInput.value.email,
        number: numberMaskedValues.unmasked,
      }),
    });

    const { email, number } = await response.json();
    dataFromServer.value = { email, number };
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    pending.value = false;

    offTimer(countdown);
  }
}

function startCountdown() {
  let countdown = setInterval(() => {
    timerValue.value--;

    if (timerValue.value <= 0) {
      showTimer.value = false;
      timerValue.value = 5;
      clearInterval(countdown);
    }
  }, 1000);

  return countdown;
}

function removeOldServerData() {
  dataFromServer.value = {
    email: "",
    number: "",
  };
}

function offTimer(timerId: any) {
  timerValue.value = 5;
  showTimer.value = false;
  clearInterval(timerId);
}

function abortFetch() {
  abortController.abort();
}
</script>

<template>
  <Form :validation-schema="schema" @submit="onSubmit">
    <Field
      v-model="emailUserInput.email"
      placeholder="example@email.com"
      name="email"
      type="email"
    />
    <ErrorMessage name="email" />
    <input
      v-maska="numberMaskedValues"
      data-maska="##-##-##"
      placeholder=" 99-99-99"
      type="tel"
    />
    <button v-if="pending" class="submit-input" @click="abortFetch()">
      Stop
    </button>
    <button v-else class="submit-input">Check</button>
  </Form>
  <div>
    <span v-if="dataFromServer.email"> {{ dataFromServer.email }}</span>
  </div>
  <div>
    <span v-if="dataFromServer.number"> {{ dataFromServer.number }}</span>
  </div>
  <div>
    <p v-if="showTimer">Timer: {{ timerValue }}</p>
  </div>
</template>

<style scoped>
Form {
  display: block;
  width: 650px;
  margin: 30px auto;
}
input {
  width: 60%;
  height: 20px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 10px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}

.submit-input {
  width: 50%;
  height: 40px;
  background: #e0dede;
  justify-content: center;
  display: flex;
  margin: 20px auto;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
}
</style>
