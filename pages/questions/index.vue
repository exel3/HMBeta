<template>
<Loading v-if="$fetchState.pending" class="fetchState" />
  <section v-else>
    <article class="newTable">
      <div class="titleCard"><p>Seleccionar</p></div>
      <div class="contentCard">
        <form>
          <div v-if="user.type === 'admin'" class="selectContainer">
            <label for="owner">Dueño</label>
            <select
              id="owner"
              class="selectlocal"
              name="owner"
              @change="setOwnerSelected($event.target.value)"
            >
              <option selected value="Default">Seleccione dueño...</option>
              <option
                v-for="owner in owners"
                :key="'dropBox' + owner.id"
                :value="owner.username"
              >
                {{ owner.username }}
              </option>
            </select>
          </div>
          <div class="selectContainer">
            <label for="local">Local</label>
            <select
              id="local"
              class="selectlocal"
              name="local"
              @change="setLocalSelected($event.target.value)"
            >
              <option selected value="Default">Seleccione local...</option>
              <option v-for="local in localsFilter" :key="'dropBox' + local.id">
                {{ local.name }}
              </option>
            </select>
          </div>
        </form>
      </div>
    </article>
        <article v-if="localSelected.id" class="newTable">
      <div class="titleCard"><p>Defina tipo de preguntas que se mostraran en este local</p></div>
      <div class="contentCard">
        <form>
          <div v-if="user.type === 'admin'" class="selectContainer">
            <label for="owner">Mostrar preguntas</label>
            <select
              id="onlyQuestions"
              :disabled="currentQuestions.length !== 3"
              class="selectlocal"
              name="onlyQuestions"
              @change="setOnlyLocalQuestions($event.target.value)"
            >
              <option :selected="localSelected.activateLocalQuestion===false" :value="false">Globales y locales</option>
                 <option :selected="localSelected.activateLocalQuestion===true" :value="true">Solo locales</option>
            </select>
            <p v-if="currentQuestions.length !== 3" class="infoText">*Se deben crear preguntas locales para editar este campo</p>
          </div>
        </form>
      </div>
    </article>
    <article v-if="currentQuestions.length < 3 && localSelected.id" class="newQuestionArticle">
      <div class="titleCard"><p>Nueva pregunta</p></div>
      <div class="newQuestionContainer">
        <form @submit.prevent="">
          <div class="newQuestionForm">
            <label for="newQuestion">Pregunta</label>
            <input
              id="newQuestion"
              v-model="newQuestion"
              type="text"
              autocomplete="off"
              @keyup.enter.prevent="addNewQuestion"
            />
          </div>
          <div v-if="showNewAnswersInput" class="newAnswerForm">
            <input
              v-model="newAnswers[0]"
              type="text"
              autocomplete="off"
              placeholder="Respuesta"
               @keyup.enter.prevent="addNewQuestion"
            />
          </div>
          <div v-if="showNewAnswersInput" class="newAnswerForm">
            <input
              v-model="newAnswers[1]"
              type="text"
              autocomplete="off"
              placeholder="Respuesta"
               @keyup.enter.prevent="addNewQuestion"
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
    <article class="userList">
      <div class="titleCard"><p>Lista de preguntas</p></div>
    </article>
    <article
      v-for="(question, indexQuestion) in tableFilter"
      :key="question._id"
      class="answerList"
    >
      <table>
        <thead>
          <tr>
            <th>
              <input
                v-model="currentQuestions[indexQuestion].question"
                class="questionInput"
                @blur="
                  showToast()
                  confirmChangeQuestion()
                "
              />
            </th>
            <th>
              <img
                v-if="currentQuestions.length > 3"
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
            :key="answer._id"
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
                class="imgDeleteAnswer"
                src="@/assets/icons/deleteGray.svg"
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
import Loading from '@/components/ui/Loading.vue'
export default {
  name: 'QuestionsIndex',
  components: {
    DeleteModal,
     Loading,
  },
  data: () => ({
    loadingMode: false,
    showDeleteModal: '',
    localsFilter: [],
    owners: [],
    ownersWithLocals: [],
    showNewAnswersInput: false,
    ownerSelected: {},
    localSelected: {},
    currentQuestions: [],
    questionLength: 0,
    tableFilter: [],
    locals: [],
    localAnswers: [],
    newQuestion: '',
    newAnswers: ['',''],
    buttonAddTitle: 'Agregar',
    user: {
      id: '',
      type: '',
      username: '',
    },
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then(async (response) => {
        this.user = response
        this.user.type === 'admin'
          ? await this.$axios
              .$get('/api/getAllClients')
              .then(async (response) => {
                this.owners = response.clients
                await this.$axios
                  .$get('/api/getAllLocals')
                  .then((response) => {
                    this.locals = response.locals
                    this.localsFilter = response.locals
                    this.ownersWithLocals = this.owners.map((o) => {
                      const localsArray = this.locals.filter((l) =>
                        o.locals.includes(l.id)
                      )
                      const resp = { ...o, localsArray }
                      return resp
                    })
                  })
                  .catch((e) => {
                    this.$toasted.show(`Error al recuperar dueños: ${e}`, {
                      theme: 'toasted-primary',
                      position: 'top-right',
                      duration: 5000,
                    })
                  })
              })
              .catch((e) => {
                this.$toasted.show(`Error al recuperar locales: ${e}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
              })
          : await this.$axios
              .$get(`/api/getLocalsByClient/${this.user.id}`)
              .then( (response) => {
                this.locals = response.locals
                this.localsFilter = response.locals
              })
              .catch((e) => {
                this.$toasted.show(`Error al recuperar locales: ${e}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
              })
      })
      .catch((e) => {
        this.$toasted.show(`Error al recuperar el tipo de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      })
  },
  methods: {
    setOnlyLocalQuestions(event) {
      if (this.currentQuestions.length === 3 || event === 'false') {
      let boolean = false
      event === 'true'? boolean = true : boolean = false
      const body = { activateLocalQuestion:boolean}
      this.$axios.$put(`/api/updateLocal/${this.localSelected.id}`, body)
        .then(res => {
           this.$toasted.show(`Muestreo de preguntas actualizado`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
        this.localSelected = res.local
      }
        )
           .catch((e) => {
          this.loadingMode = false
          this.$toasted.show(
            `Error al actualizar muestreo de preguntas: ${e}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000,
            }
          )
        })
      }
      else {
             this.$toasted.show(
            `Se deben crear 3 preguntas locales para poder usar esta configuracion`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000,
            }
          )
      }
    },
    setLocalSelected(localName) {
      if(this.user.type === 'admin'){
      if(localName !== "Default"){
      const ownerLocals = this.locals.filter(
        (l) => l.client === this.ownerSelected.id
      )
      this.localSelected = ownerLocals.find((l) => l.name === localName)
      this.getQuestionsByLocal()
      } else {
        this.tableFilter = []
      }}
      else {
        this.localSelected = this.locals.find(l => l.name === localName)
           this.getQuestionsByLocal()
      }
    },
    setOwnerSelected(ownerName) {
    if(ownerName !== "Default"){
      this.ownerSelected = this.ownersWithLocals.find(
        (o) => ownerName === o.username
      )
      this.localsFilter = this.locals.filter(
        (l) => l.client === this.ownerSelected.id
      )
      this.localSelected = {}
    } else {
       this.localsFilter = []
    }
      this.tableFilter = []
    },
    async getQuestionsByLocal() {
      this.currentQuestions = []
      this.tableFilter = []
      this.loadingMode = true
      const localID = this.localSelected.id
      await this.$axios
        .$get(`/api/getQuestionsByLocalId/${localID}`)
        .then((res) => {
          if (res) {
            this.questionLength = res.questions.length
            this.currentQuestions = res.questions
            this.tableFilter = res.questions
          }
          this.loadingMode = false
        })
        .catch((e) => {
          this.loadingMode = false
          this.$toasted.show(
            `Error al recuperar preguntas: ${JSON.stringify(
              e.response.data.error['Errors List']
            )}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000,
            }
          )
        })
    },
    addNewQuestion() {
      if ((this.newQuestion !== '') & (this.buttonAddTitle === 'Agregar')) {
        this.changeShowNewAnswersInput()
        this.buttonAddTitle = 'Confirmar'
      } else if (this.localSelected.id === undefined) {
        this.$toasted.show(`Debe seleccionar un local`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else if (this.newAnswers.includes('')) {
        this.$toasted.show(`Debe completar dos respuestas`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })} 
      else {
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
        if (this.currentQuestions === undefined) {
          this.currentQuestions = []
        }
        this.currentQuestions.push(temporalQuestion)
        this.tableFilter.push(temporalQuestion)
        const localId = this.localSelected.id
        const body = this.currentQuestions
        if (this.currentQuestions.length < 3) {
          this.$toasted.show(`Se deben crear por lo menos 3 preguntas`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })
        } else if (localId === undefined) {
          this.$toasted.show(`Seleccione un local`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })
        } else if (this.questionLength > 0) {
          this.confirmChangeQuestion()
        } else {
          await this.$axios
            .$post(`/api/createQuestions/${localId}`, body)
            .then((res) =>
              this.$toasted.show('Cambios guardados', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 2000,
              })
            )
            .catch((e) => {
              this.$toasted.show(
                `Error al guardar cambios:${JSON.stringify(
                  e.response.data.error['Errors List']
                )}`,
                {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 10000,
                }
              )
              this.loadingMode = false
            })
        }
        this.newQuestion = ''
        this.newAnswers = ['','']
        this.showNewAnswersInput = false
        this.buttonAddTitle = 'Agregar'
      }
    },

    confirmChangeQuestion() {
      const localId = this.localSelected.id
      const body = this.currentQuestions
      const emptyAswers = this.currentQuestions.filter(q => q.answers.includes(''))
      if (this.currentQuestions.length < 3) {
        this.$toasted.show(`Se deben crear por lo menos 3 preguntas`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else if (localId === undefined) {
        this.$toasted.show(`Seleccione un local`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      }
      else if (emptyAswers.length > 0) {
        this.$toasted.show(`No se admiten respuetas vacias`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$axios
          .$put(`/api/updateQuestions/${localId}`, body)
          .then((res) =>
            this.$toasted.show('Cambios guardados', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 2000,
            })
          )
          .catch((e) => {
            this.$toasted.show(
              `Error al guardar cambios:${JSON.stringify(
                e.response.data.error['Errors List']
              )}`,
              {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000,
              }
            )
            this.loadingMode = false
          })
      }
    },

    deleteQuestion(question) {
      this.currentQuestions = this.currentQuestions.filter(
        (q) => question.question !== q.question
      )
        this.tableFilter = [...this.currentQuestions]
      try {
        this.$toasted.show('Borrando pregunta..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        })
        this.confirmChangeQuestion()
      } catch (e) {
        this.$toasted.show(`Error al borrar pregunta: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      }
    },
    deleteAnswer(questionIndex, answer) {
      this.currentQuestions[questionIndex].answers = this.currentQuestions[
        questionIndex
      ].answers.filter((a) => answer !== a)
      try {
        this.confirmChangeQuestion()
        this.$toasted.show('Borrando respuesta..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000,
        })
      } catch (e) {
        this.$toasted.show(`Error al borrar respuesta: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      }
    },
    addNewAnswer(questionIndex) {
      this.currentQuestions[questionIndex].answers.push('')
    },
    showToast() {
      this.$toasted.show('Guardando cambios..', {
        theme: 'toasted-primary',
        position: 'top-right',
        duration: 2000,
      })
    },
  },
}
</script>
<style scoped>
@media (max-width: 1000px) {
  section {
    padding: 0 0.1rem;
  }
  td {
    padding: 0.1rem 0.1rem;
  }
  th {
    padding: 0.5rem 0.1rem;
  }
  .newTable {
    max-height: 30rem;
  }
  .titleCard {
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    gap: 1rem 0;
  }
  .contentCard form {
    display: grid;
    grid-auto-flow: row;
    align-items: center;
    gap: 1rem 0;
  }
}
@media (min-width: 1000px) {
  section {
    padding: 0 5rem;
  }
  td {
    padding: 0.5rem;
  }
  th {
    padding: 0.5rem;
  }
  .newTable {
    max-height: 30rem;
  }
  .titleCard {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
  }
  .contentCard form {
    display: grid;
    grid-auto-flow: column;
    gap: 0 1rem;
  }
}
section {
  position: relative;
  background: var(--background-color);
  display: grid;
  grid-auto-flow: row;
  gap: 2rem 0;
  margin-top: 4rem;
  box-sizing: border-box;
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

.selectlocal {
  width: 100%;
  height: 2rem;
  padding: 0 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #656a6f;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
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
  color: #656a6f;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
}

.contentCard {
  position: relative;
  box-sizing: border-box;
  padding: 1rem;
}

.contentCard form {
  box-sizing: border-box;
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
.newTable {
  overflow: hidden;
}
.searchContainer {
  height: 100%;
  width: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.searchContainer form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.searchContainer input {
  box-sizing: border-box;
  height: 2.5rem;
  padding: 0 3rem;
  outline: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.searchIcon {
  position: absolute;
  top: 0.55rem;
  left: 1rem;
  z-index: 1;
}
.clearIcon {
  position: absolute;
  top: 0.55rem;
  left: calc(100% - 3rem);
  z-index: 1;
  cursor: pointer;
}

.imgDeleteAnswer {
  width: 1.3rem;
}

.inputContainer {
  width: 80%;
  position: relative;
  border: none;
  box-sizing: border-box;
}
.infoText {
  font-size: 0.7rem;
  padding-top: 0.5rem;
  color:#525f7f
  }
</style>