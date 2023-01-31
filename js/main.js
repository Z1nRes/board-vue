
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
                    title: 'title1',
                    points: [
                        'dsad',
                        'dasdsa',
                        'qwe',
                    ],
                    type: 'col-1',
                },
                {
                    title: 'title2',
                    points: [
                        'dsad',
                        'dasdsa',
                        'qwe',
                    ],
                    type: 'col-2',
                },
                {
                    title: 'title3',
                    points: [
                        'dsad',
                        'dasdsa',
                        'qwe',
                    ],
                    type: 'col-3',
                },
            ]
        }
    },
    template: `
        <div>
            <div class="m-3 p-3 border border-danger" v-for="note in notes">
                <h5>{{note.title}}</h5>
                <ul>
                    <li v-for="point in note.points">{{ point }}</li>
                </ul>
            </div>
        </div>
    `,
})

let app = new Vue({
    el: '#app',
    data: {

    },

})