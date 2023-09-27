
const CODE = [4, 11, 9, 2, 14, 5, 0, 13, 10, 6, 1, 8, 12, 3, 7];
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];


const SPACES = "+-() ";
export function buildCustomerNumber(phone) {

    let p = phone || "";
    for(const x of SPACES) p = p.split(x).join("");
    while (p.length < 15) p = '0'+p;


    if(p.length > 15) p = p.substring(p.length-15, p.length);
    // console.log("ppp", p);

    //if(!p.every(p => p >= '0' && p <= '9')) return "NA";

    let a = [];
    for(const ch of p) a.push(9-1*ch);
    if(!a.every(x => !isNaN(x) && x >= 0 && x <= 9)) return "NA";

    // console.log(a);

    //
    // let sum = 0;
    // for(const i in arr) {
    //     console.log(i + " "+ arr[i]);
    //     sum += (1+i)*arr[i];
    // }
    // console.log(sum);

    // for(let i=0; i<15; i++) a[i] = i;

    //a: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    // console.log("a", a);
    // let b = [];
    // for(let i=0; i<8; i++) {
    //     if(i === 7) {
    //         b[14] = a[14];
    //     } else {
    //         b[2*i] = a[i];
    //         b[2*i+1] = a[i+7];
    //     }
    // }
    // //b: [0, 7, 1, 8, 2, 9, 3, 10, 4, 11, 5, 12, 6, 13, 14]
    // // console.log("b", b);
    //
    // let c = [];
    // for(let i=0; i<8; i++) {
    //     if(i === 7) {
    //         c[14] = b[14];
    //     } else {
    //         c[2*i] = b[i];
    //         c[2*i+1] = b[i+7];
    //     }
    // }
    // //c: [0, 10, 7, 4, 1, 11, 8, 5, 2, 12, 9, 6, 3, 13, 14]
    // // console.log("c", c);
    //
    //

    //console.log(arr);

    let c = [];
    for(let i=0; i<15; i++) {
        c[i] = a[CODE[i]];
    }

    // let sum = 0;
    // for(let i=0; i<15; i++) {
    //     // console.log(i + " "+ c[i]);
    //     sum += (1+i)*c[i];
    // }
    c[15] = checkSum(c);
    // console.log(sum, c[15], sum%10);


    return c.join("");


    // return p;
}

export function sumDigits(n) {
    let sum = 0;
    while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
    }
    return sum;
}

export function sumDigits0(n) {
    while (n >= 10) n = sumDigits(n);
    return n;
}

function checkSum(c) {
    let sum = 7;
    for(let i=0; i<15; i++) {
        const a = 1*c[i];
        // if(isNaN(a) || a < 0 || a > 9) return -2537;
        sum += PRIMES[i]*a;
    }
    return sumDigits0(sum);
}

export function formalCustomerNumber(number) {
    return (number || "").split("-").join("");
}

export function validCustomerNumber(number) {
    const p = formalCustomerNumber(number || "");
    if(p.length !== 16) return false;
    let sum = 0;
    let c = [];
    for(let i=0; i<16; i++) {
        const a = 1*p[i];
        if(isNaN(a) || a < 0 || a > 9) return false;
        c.push(a);
    }
    return 1*p[15] === checkSum(c);
}

export function stdCustomerNumber(number) {
    if(!number || number.length !== 16) return number;
    return [
        number.substring(0, 4),
        number.substring(4, 8),
        number.substring(8, 12),
        number.substring(12, 16),
    ].join("-");
}
