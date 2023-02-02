let eventBus = new Vue()

Vue.component('note', {
    props: {
        types: ''
    },
    data() {
        return {
            notes: [
                {
                    title: 'title2',
                    points: [
                        {
                            pointTitle: 'first point',
                            pointStatus: false
                        },
                        {
                            pointTitle: 'second point',
                            pointStatus: true
                        },
                        {
                            pointTitle: 'third point',
                            pointStatus: false
                        }
                    ],
                    type: 'col-2',
                    date: '',
                    progress: 0
                },
                {
                    title: 'title3',
                    points: [
                        {
                            pointTitle: 'first point',
                            pointStatus: true
                        },
                        {
                            pointTitle: 'second point',
                            pointStatus: true
                        },
                        {
                            pointTitle: 'third point',
                            pointStatus: true
                        }
                    ],
                    type: 'col-3',
                    date: '',
                    progress: 1.0
                }
            ],
            countFirstCol: 0,
            countSecondCol: 0,
            displayForm: true
        }
    },
    template: `
        <div>
            <div class="m-3 p-3 border border-danger" v-for="note in notes" v-show="note.type == types ">
                <h5>{{note.title}}</h5>
                <ul>
                    <li 
                        v-for="point in note.points" 
                        :class="{markPoint: point.pointStatus}"
                        @click="donePoint(point, note)" 
                        @click="countDonePoints(note)"
                        @click="checkCount()"
                        @click="checkType(note)"
                        @click="dateSet(note)"
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
    },
    methods: {
        donePoint(point) {
            if (point.pointStatus == false) {
                point.pointStatus = true
            } else {
                point.pointStatus = false
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
            console.log(this.displayForm)
            if ( note.progress == 1) {
                note.type = 'col-3'
            }
            if (note.progress >= 0 && note.progress < 0.5) {
                if (this.countFirstCol >= 3) {
                    this.displayForm = false
                    eventBus.$emit('takeDisplayForm', this.displayForm)
                    console.log('Количество достигло 3х в кол-1')
                } else {
                    this.displayForm = true
                    eventBus.$emit('takeDisplayForm', this.displayForm)
                    note.type = 'col-1'
                }
            }
            if (note.progress >= 0.5 && note.progress < 1) {
                note.type = 'col-2'
            }
        },
        dateSet(note){
            if (note.progress == 1) {
                let today = new Date().toLocaleString()
                note.date = today
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
            console.log(this.countFirstCol, '====', this.countSecondCol)
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
            errors: [],
        }
    },
    template: `
        <div class="d-flex justify-content-center">
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
            <form class="d-flex flex-column w-50 mt-4" @submit.prevent="createNote">
                <fieldset id="fieldset">
                    <input class="form-control mb-3" type="text" placeholder="Заголовок" v-model="title">
                    <div class="form-floating mb-3">
                        <textarea class="form-control" placeholder="Напишите здесь ваши заметки" id="textarea" style="height: 200px; resize: none;" v-model="points"></textarea>
                        <label for="textarea">Введите 3-5 пунктов. Каждый пункт писать с новой строки!</label>
                    </div>
                    <input class="btn btn-primary" type="submit" value="Создать">
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
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        types: ['col-1', 'col-2', 'col-3'],
        displayForm: true
    },
    mounted() {
        eventBus.$on('takeDisplayForm', display =>{
            this.displayForm = display
        })
    }
})