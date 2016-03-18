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

@Pipe({
    name: 'phoneNumberMask'
})
export class phoneNumberMask {
    transform (value) {
        var strArr = value.split('');
        for (let i=0; i < strArr.length; i++) {
            if (i == 0) {
                strArr[i] = '(' + strArr[i];
            }
            else if (i == 2) {
                strArr[i] = strArr[i] + ') ';
            }
            else if (i == 5) {
                strArr[i] = strArr[i] + ' ';
            }
            else if (i == 7) {
                strArr[i] = strArr[i] + ' ';
            }
        }

        return strArr.join('');
    }
}
