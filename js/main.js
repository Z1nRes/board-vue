let eventBus = new Vue()

Vue.component('first-col', {
    template: `
        <div class="col" style="height: 90vh;">
            <note></note>    
        </div>
    `,
    
})

Vue.component('second-col', {
    template: `
        <div class="col border-end border-start border-primary" style="height: 90vh;">
            <note></note>    
        </div>
    `,
})

Vue.component('third-col', {
    template: `
        <div class="col" style="height: 90vh;">
            <note></note>   
        </div>
    `,
})

Vue.component('note', {
    data() {
        return {
            notes: [
                {
                    title: 'title2',
                    points: [
                        'dsad',
                        'dasdsa',
                        'qwe',
                    ],
                    type: 'col-2',
                }
            ]
        }
    },
    template: `
        <div>
            <div class="m-3 p-3 border border-danger" v-for="note in notes">
                <h5>{{note.title}}</h5>
                <ul>
                    <li v-for="point in note.points">
                        {{ point }}
                    </li>
                </ul>
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
            type: '',
            test: ['', '', 'eqwe', 'qwewqe']
        }
    },
    template: `
        <div class="d-flex justify-content-center">
            <form class="d-flex flex-column w-50 mt-4" @submit.prevent="createNote">
                <input class="form-control mb-3" type="text" placeholder="Заголовок" v-model="title">
                <div class="form-floating mb-3">
                    <textarea class="form-control" placeholder="Напишите здесь ваши заметки" id="textarea" style="height: 200px; resize: none;" v-model="points"></textarea>
                    <label for="textarea">Каждый пункт писать с новой строки!</label>
                </div>
                <input class="btn btn-primary" type="submit" value="Создать">
            </form>
        </div>
    `,
    methods: {
        filterNote() {
            let newTest = []
            console.log(typeof(this.test))
            for (i in this.test) {
                console.log(this.test[i])
                if (this.test[i].lenght != 0) {
                    
                }
            }
            console.log(newTest)
        },
        createNote() {
            if (this.title && this.points) {
                let note = {
                    title: this.title,
                    points: this.points.split("\n"),
                    type: 'col-1'
                }
                this.filterNote()
                eventBus.$emit('note-created', note)
                this.title = '',
                this.points = ''
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {

    },

})