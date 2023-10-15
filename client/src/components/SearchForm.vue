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
let abortController = new AbortController();

function onSubmit() {
  startTimer();
  if (pending.value) {
    abortController.abort();
    pending.value = false;
  }

  pending.value = true;
  dataFromServer.value = {
    email: "",
    number: "",
  };
  fetch("http://localhost:8000/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    body: JSON.stringify({
      email: emailUserInput.value.email,
      number: numberMaskedValues.unmasked,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { email, number } = data;
      dataFromServer.value = { email, number };
      pending.value = false;
      abortController = new AbortController();
    })
    .catch((error) => {
      abortController = new AbortController();
      pending.value = false;
      console.error("Ошибка:", error);
    });
}

function startTimer() {
  showTimer.value = true;
  let countdown = setInterval(() => {
    timerValue.value--;

    if (timerValue.value <= 0) {
      showTimer.value = false;
      timerValue.value = 5;
      clearInterval(countdown);
    }
  }, 1000);
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
    <button v-if="pending" class="submit-input" type="submit">Stop</button>
    <button v-else class="submit-input" type="submit">Check</button>
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
