import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'arrayCutTop'
})
export class arrayCutTop {
    transform (value) {
        let cutVal = [];
        for (let i in value) {
            if (Number(i) < 2) {
                cutVal.push(value[i])
            }
        }

        return cutVal;
    }
}

@Pipe({
    name: 'arrayCutBottom'
})
export class arrayCutBottom {
    transform (value) {
        let cutVal = [];
        for (let i in value) {
            if (Number(i) > 1) {
                cutVal.push(value[i])
            }
        }
        return cutVal;
    }
}
