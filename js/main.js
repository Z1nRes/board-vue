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
                        'first point',
                        'second point',
                        'third point',
                    ],
                    type: 'col-2',
                    progress: 0.5
                },
                {
                    title: 'title3',
                    points: [
                        'first point',
                        'second point',
                        'third point',
                    ],
                    type: 'col-3',
                    progress: 1.0
                }
            ]
        }
    },
    template: `
        <div>
            <div class="m-3 p-3 border border-danger" v-for="note in notes" v-show="note.type == types ">
                <h5>{{note.title}}</h5>
                <ul>
                    <li v-for="point in note.points">
                        {{ point }}
                    </li>
                </ul>
                <p v-if="note.type == 'col-3'">
                    data
                </p>
            </div>
        </div>
    `,
    mounted() {
        eventBus.$on('note-created', note => {
            this.notes.push(note)
        })
    }
})

Vue.component('create-note', {
    data() {
        return {
            title: '',
            points: '',
            type: 'col-1',
            progress: 0,
            errors: []
        }
    },
    template: `
        <div class="d-flex justify-content-center">
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
            <form class="d-flex flex-column w-50 mt-4" @submit.prevent="createNote">
                <input class="form-control mb-3" type="text" placeholder="Заголовок" v-model="title">
                <div class="form-floating mb-3">
                    <textarea class="form-control" placeholder="Напишите здесь ваши заметки" id="textarea" style="height: 200px; resize: none;" v-model="points"></textarea>
                    <label for="textarea">Введите 3-5 пунктов. Каждый пункт писать с новой строки!</label>
                </div>
                <input class="btn btn-primary" type="submit" value="Создать">
            </form>
        </div>
    `,
    methods: {
        createNote() {
            let note = {
                title: this.title,
                points: this.points.split("\n"),
                type: this.type,
                progress: this.progress
            }
            if (this.title && this.points && 3 <= note.points.length && note.points.length <= 5) {
                    eventBus.$emit('note-created', note)
                    this.title = null
                    this.points = null
                    this.errors = []
            } else {
                this.errors = []
                if (!this.title) this.errors.push("Введите заголовок!")
                if (!this.points) this.errors.push("Введите пункты заметки!")
                if ( 3 >= note.points.length) this.errors.push("Кол-во пунктов должно быть от 3х!")
                if ( note.points.length >= 5) this.errors.push("Кол-во пунктов должно быть не более 5ти!")
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        types: ['col-1', 'col-2', 'col-3'],
        createdCounter: 0,
        halfProgressCounter: 0,
    },
    methods: {

    }

})