<template>
  <section>
    <transition name="fade">
      <article class="newQuestionArticle">
        <div class="titleCard"><p>Nueva pregunta</p></div>
        <div class="newQuestionContainer">
          <form>
            <div class="newQuestionForm">
              <label for="newQuestion">Pregunta</label>
              <input
                id="newQuestion"
                v-model="newQuestion"
                type="text"
                autocomplete="off"
              />
            </div>
            <div v-if="showNewAnswersInput" class="newAnswerForm">
              <input
                v-model="newAnswers[0]"
                type="text"
                autocomplete="off"
                placeholder="Respuesta"
              />
            </div>
            <div v-if="showNewAnswersInput" class="newAnswerForm">
              <input
                v-model="newAnswers[1]"
                type="text"
                autocomplete="off"
                placeholder="Respuesta"
              />
            </div>
          </form>
        </div>
        <div class="containerAddBtn">
          <button @click.prevent="addNewQuestion()">
            {{ buttonAddTitle }}
          </button>
        </div>
      </article>
    </transition>
    <article class="userList">
      <div class="titleCard"><p>Lista de preguntas</p></div>
    </article>
    <article
      v-for="(question, indexQuestion) in questionsSelected"
      :key="question.id"
      class="answerList"
    >
      <table>
        <thead>
          <tr>
            <th>
              <input
                v-model="questionsSelected[indexQuestion].question"
                class="questionInput"
                @blur="showToast();confirmChangeQuestion()"
              />
            </th>
            <th>
              <img
                src="@/assets/icons/deleteGray.svg"
                @click="deleteQuestion(question)"
              /><img
                v-if="question.answers.length < 3"
                src="@/assets/icons/add.svg"
                @click="addNewAnswer(indexQuestion)"
              /><img v-else class="invisibleImg" src="@/assets/icons/add.svg" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(answer, indexAnswer) in question.answers"
            :key="answer.id"
          >
            <td>
              <input
                v-model="question.answers[indexAnswer]"
                class="answerInput"
                @blur="confirmChangeQuestion()"
              />
            </td>
            <td class="tdDelete">
              <img
                v-if="question.answers.length > 2"
                src="@/assets/icons/delete.svg"
                @click="deleteAnswer(indexQuestion, answer)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </article>
    <DeleteModal
      v-if="showDeleteModal"
      @delete-user="deleteUser"
      @cancel-delete="showDeleteModal = false"
    />
  </section>
</template>
<script>
import DeleteModal from '@/components/users/DeleteModal.vue'
export default {
  name: 'QuestionsIndex',
  components: {
    DeleteModal,
  },
  data: () => ({
    showDeleteModal: '',
    showNewAnswersInput: false,
    localSelected: [],
    questionsSelected: [],
    locals: [],
    clientId: '1234',
    localAnswers: [],
    newQuestion: '',
    newAnswers: [],
    buttonAddTitle: 'Agregar',
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then((response) => {
        this.locals = response.locals
        this.clientId = response.id
      })
      .catch((e) => {
            this.$toasted.show(`Error recuperando los datos de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
      })
    this.locals.length > 0 &&
      (await this.$axios
        .$get(`/api/getQuestions/${this.locals[0].id}`)
        .then((res) => {
          this.locals[0].questions = res.questions
        })
        .catch((e) =>  this.$toasted.show(`Error recuperando los datos de preguntas: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })))
    await this.setLocalSelected(this.locals[0])
  },
  mounted() {
    this.getLocals()
  },
  methods: {
    setLocalSelected(local) {
      this.localSelected = this.locals.find((l) => l.id === local.id)
      this.questionsSelected = this.localSelected.questions
    },
    getLocals() {
      this.$axios
        .$get('/api/getUser')
        .then((response) => {
          this.locals = response.locals
          this.clientId = response.id
          this.locals.map(async (l) => {
            ;(l.tables = await this.getGroupTables(l.id))(
              (l.questions = await this.getQuestions(l.id))
            )
          })
        })
        .catch((e) => {
          this.$toasted.show(`Error recuperando los datos de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
        })
      this.localSelected = this.locals.find((l) => l)
    },
    addNewQuestion() {
      if ((this.newQuestion !== '') & (this.buttonAddTitle === 'Agregar')) {
        this.changeShowNewAnswersInput()
        this.buttonAddTitle = 'Confirmar'
      } else {
       

        this.$toasted.show('Creando pregunta..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        })
         this.confirmAddNewQuestion()
      }
    },
    changeShowNewAnswersInput() {
      this.showNewAnswersInput = true
    },
    async confirmAddNewQuestion() {
      if (
        (this.newAnswers.filter((a) => a.answer === '').length === 0) &
        (this.newQuestion !== '')
      ) {
        // TODO: addNewQuestion in bd
        const temporalQuestion = {
          question: this.newQuestion,
          answers: this.newAnswers,
        }
        await this.questionsSelected.push(temporalQuestion)
        this.confirmChangeQuestion()
        this.newQuestion = ''
        this.newAnswers = []
        this.showNewAnswersInput = false
        this.buttonAddTitle = 'Agregar'
      }
    },

    confirmChangeQuestion() {
      const localId = this.localSelected.id
      const questions = this.questionsSelected
      const body = { localId, questions }

      this.$axios
        .$post('/api/updateQuestions', body)
        .then((res) => this.$toasted.show('Cambios guardados', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        }))
        .catch((e) => {
         this.$toasted.show(`Error al guardar los cambios: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
        })
    },

    deleteQuestion(question) {
      this.questionsSelected = this.questionsSelected.filter(
        (q) => question.question !== q.question
      )
      try {
     
          this.$toasted.show('Borrando pregunta..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        })
         this.confirmChangeQuestion()
      }
      catch (e){
            this.$toasted.show(`Error al borrar pregunta: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      }
    },
    deleteAnswer(questionIndex, answer) {
      this.questionsSelected[questionIndex].answers = this.questionsSelected[
        questionIndex
      ].answers.filter((a) => answer !== a)
         try {
      this.confirmChangeQuestion()
          this.$toasted.show('Borrando respuesta..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        })
      }
      catch (e){
            this.$toasted.show(`Error al borrar respuesta: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      }
    },
    addNewAnswer(questionIndex) {
      this.questionsSelected[questionIndex].answers.push('')
    },
    showToast(){
        this.$toasted.show('Guardando cambios..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        })
    }
  },
}
</script>
<style scoped>
section {
  position: relative;
  background: var(--background-color);
  display: grid;
  grid-auto-flow: row;
  gap: 2rem 0;
  margin-top: 4rem;
  box-sizing: border-box;
  padding: 0 5rem;
}

article {
  background: white;
  border: 0;
  box-sizing: border-box;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-radius: 0.375rem;
  z-index: 2;
  overflow: hidden;
}
.answerList {
  margin-bottom: 1rem;
}

.newUser {
  max-height: 15rem;
}

.titleCard {
  padding: 1.25rem 1.5rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.titleCard p {
  font-size: 1.0625rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
}

label {
  color: #525f7f;
  font-size: 0.875rem;
  font-weight: 600;
}

input {
  width: 100%;
  height: 2rem;
  padding: 0.625rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #8898aa;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
}

.contentCard form {
  display: grid;
  grid-auto-flow: column;
  box-sizing: border-box;
  gap: 0 1rem;
}

.contentCard form div {
  display: grid;
  grid-auto-flow: row;
}
.containerAddBtn {
  max-height: 4rem;
  display: grid;
  justify-items: end;
  padding-bottom: 1.25rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

.containerAddBtn button {
  width: 8rem;
  height: 2rem;
  border: none;
  text-transform: none;
  transition: all 0.15s ease;
  letter-spacing: 0.025em;
  font-size: 0.875rem;
  will-change: transform;
  color: #fff;
  background-color: #5e72e4;
  border-color: #5e72e4;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  padding: 5px;
}

th {
  padding: 1rem;
  background: #f6f9fc;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  color: #8898aa;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: start;
}
td {
  padding: 1rem;
  border-bottom: 1px solid #ebeef5;
  line-height: 1;
  text-align: start;
  white-space: nowrap;
  font-weight: 400;
  font-size: 0.875rem;
  text-transform: none;
  color: #525f7f;
}

table img {
  cursor: pointer;
}

.newQuestionContainer {
  display: grid;
  grid-auto-flow: row;
  position: relative;
  box-sizing: border-box;
  padding: 1rem;
}

.questionInput {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
}

.answerInput {
  line-height: 1.5;
  color: #525f7f;
  font-weight: 400;
}
#newQuestion {
  margin-top: 1rem;
}
.newQuestionForm {
  margin-bottom: 1rem;
}
.newAnswerForm {
  margin-bottom: 1rem;
}
.invisibleImg {
  opacity: 0;
  cursor: default;
}
</style>