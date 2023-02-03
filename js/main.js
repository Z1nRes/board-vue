let eventBus = new Vue()

Vue.component('note', {
    props: {
        types: ''
    },
    data() {
        return {
            notes: [],
            countFirstCol: 0,
            countSecondCol: 0,
            display: true
        }
    },
    template: `
        <div>
            <div class="m-3 p-3 border border-danger" v-for="note in notes" v-show="note.type == types ">
                <h5>{{note.title}} - {{note.type}}</h5>
                <ul>
                    <li 
                        v-for="point in note.points" 
                        :class="{markPoint: point.pointStatus}"
                        @click="donePoint(point, note)" 
                        @click="countDonePoints(note)"
                        @click="checkType(note)"
                        @click="checkCount()"
                        @click="dateSet(note)"
                        @click="saveNotes()"
                    >
                        {{ point.pointTitle }} - {{ note.type }}
                    </li>
                </ul>
                <p v-if="note.type == 'col-3'">
                    Дата: {{ note.date }}
                </p>
            </div>
        </div>
    `,
    mounted() {
        eventBus.$on('note-created', note => {
            this.notes.push(note)
        })
        if (localStorage.getItem('notes')) {
            try {
                this.notes = JSON.parse(localStorage.getItem('notes'))
            } catch(e) {
                localStorage.removeItem('notes')
            }
        }
    },
    methods: {
        donePoint(point, note) {
            if (this.countSecondCol >= 5 && note.type == 'col-1') {
            } else {
                if (point.pointStatus == false) {
                    point.pointStatus = true
                } else {
                    point.pointStatus = false
                }
            }
        },
        countDonePoints(note) {
            let counterTrue = 0
            for (point in note.points) {
                if (note.points[point].pointStatus) {
                    counterTrue += 1
                }
            }
            note.progress = counterTrue / note.points.length
        },
        checkType(note) {
            if (note.progress >= 0.5 && note.progress < 1 && this.countSecondCol < 5) {
                    note.type = 'col-2'
            }
            if (note.type == 'col-2' && note.progress == 1) {
                note.type = 'col-3'
            }
            if (note.progress >= 0 && note.progress < 0.5 && this.countFirstCol < 3) {
                note.type = 'col-1'
            }
        },
        checkCount() {
            this.countFirstCol = 0
            this.countSecondCol = 0
            for (i in this.notes) {
                if (this.notes[i].type == 'col-1') {
                    this.countFirstCol += 1
                }
                if (this.notes[i].type == 'col-2') {
                    this.countSecondCol += 1
                }
            }
            if (this.countFirstCol >= 3) {
                this.display = false
            } else {
                this.display = true
            }
            eventBus.$emit('takeDisplay', this.display)
        },
        dateSet(note) {
            if (note.progress == 1) {
                let today = new Date().toLocaleString()
                note.date = today
            }
        },
        saveNotes() {
            const parsed = JSON.stringify(this.notes)
            localStorage.setItem('notes', parsed)
        }
    }
})

Vue.component('create-note', {
    data() {
        return {
            title: '',
            points: '',
            type: 'col-1',
            date: '',
            progress: 0,
            errors: []
        }
    },
    template: `
        <div>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
            <form class="d-flex flex-column mt-4 " @submit.prevent="createNote">
                <fieldset>
                    <input class="form-control mb-3" type="text" placeholder="Заголовок" v-model="title">
                    <div class="form-floating mb-3">
                        <textarea class="form-control" placeholder="Напишите здесь ваши заметки" id="textarea" style="height: 200px; resize: none;" v-model="points"></textarea>
                        <label for="textarea">Введите 3-5 пунктов. Каждый пункт писать с новой строки!</label>
                    </div>
                    <input class="btn btn-primary" type="submit" value="Создать">
                    <div class="btn btn-danger" @click="modal">Закрыть форму</div>
                </fieldset>
            </form>
        </div>
    `,
    methods: {
        createNote() {
            if (this.title && this.points && 3 <= this.points.split("\n").length && this.points.split("\n").length <= 5) {
                let inputPoints = this.points.split("\n")
                
                let newPoints = []

                for (i in inputPoints){
                    let point = {
                        pointTitle: inputPoints[i],
                        pointStatus: false
                    }
                    newPoints.push(point)
                }

                let note = {
                    title: this.title,
                    points: newPoints,
                    type: this.type,
                    date: this.date,
                    progress: this.progress
                }
                eventBus.$emit('note-created', note)
                this.title = null
                this.points = null
                this.errors = []
            } else {
                this.errors = []
                if (!this.title) this.errors.push("Введите заголовок!")
                if (!this.points) this.errors.push("Введите пункты заметки!")
                if ( 3 >= this.points.split("\n").length) this.errors.push("Кол-во пунктов должно быть от 3х!")
                if ( this.points.split("\n").length >= 5) this.errors.push("Кол-во пунктов должно быть не более 5ти!")
            }
        },
        modal() {
            let displayModal = false
            eventBus.$emit('getModal', displayModal)
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        types: ['col-1', 'col-2', 'col-3'],
        display: true,
        displayModal: false
    },
    mounted() {
        eventBus.$on('takeDisplay', display => {
            this.display = display
        })
        eventBus.$on('getModal', displayModal => {
            this.displayModal = displayModal
        })
    },
    methods: {
        modal() {
            if (this.displayModal == false) {
                this.displayModal = true
            } else {
                this.displayModal = false
            }
        }
    }
})