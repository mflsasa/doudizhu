export const randomCard = (arr, num = 3) => arr.sort(() => Math.random() - 0.5).splice(0, num)

export const dm = (id) => document.getElementById(id)

export const cardHtml = (obj, type = 'div') => {
    const d = document.createElement(type)
    d.classList.add('card-box')
    d.classList.add([1, 2].includes(obj.type) ? 'red' : 'black')
    d.innerHTML = `<div class="card"><h1>${obj.num}</h1><p>${obj.flower}</p><span>${obj.content}</span></div>`
    return d
}

export const sortBy = (field) => {
    //根据传过来的字段进行排序
    return (x, y) => {
        return y[field] - x[field]
    }
}

export const initCard = () => {
    const flowerType = {
        1: { name: '红桃', icon: '♥' },
        2: { name: '方块', icon: '♦' },
        3: { name: '梅花', icon: '♣' },
        4: { name: '黑桃', icon: '♠' },
    }
    const c1 = [1, 2, 3, 4]
    const c2 = [3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A', 2]
    const c3 = [{
        content: '小王',
        type: 5,
        value: 999,
        num: 'kind',
        flower: '🤡'
    }, {
        content: '大王',
        num: 'KIND',
        type: 5,
        flower: '🤡',
        value: 9999
    }]
    c1.forEach((i,id) => {
        c2.forEach((k,id2) => {
            const { name, icon } = flowerType[i]
            c3.push({
                content: name+k,
                type: i,
                flower: icon,
                num: k,
                value: id2+1
            })
        })
    })
    // 随机抽三张牌作为地主牌
    const tou = randomCard(c3, 3)
    const plays = []
    // 随机发牌
    new Array(c3.length).fill('').forEach((d, i) => {
        const c = randomCard(c3, 1)
        const n = i%3
        plays[n] ? plays[n].push(c[0]) : plays[n] = [c[0]]
        // document.getElementById('user'+i%3).appendChild(cardHtml(c[0]))
    })
    return { plays, tou }
}

export const QIANGDIZHU = (initCard, val) => {
    const { tou, plays } = initCard
    document.getElementById('tou').innerHTML = ''
    const chooseList = Array.prototype.slice.call(document.getElementsByClassName('choose'))
    chooseList.forEach((item) => {
        item.remove()
    })
    const play = plays[val].concat(tou)
    play.sort(sortBy('value'))
    const add = tou.map((t) => play.findIndex(f => f.type === t.type && f.num === t.num))
    add.forEach(i => {
        if (i === play.length - 1) {
            document.getElementById('user'+val).appendChild(cardHtml(play[i]))
        } else {
            document.getElementById('user'+val).insertBefore(cardHtml(play[i]), document.querySelector(`#user${val} > div:nth-child(${i+1})`))
        }
    })
    console.log(play)
}
function findFirstLeft (arr, x) {
    const l = arr.length
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][1] > x) {
            return i - 1
        }
    }
}
export const chooseEvent = (dm, e) => {
    // const childXYList = dm.children
    // if (!childXYList[0].onmouseenter) {
    //     const childrens = Array.prototype.slice.call(childXYList)
    //     childrens.forEach(item => {
    //         item.onmouseenter = () => {
    //             // console.log(item, dm.xmove)
    //         }
    //         item.onmouseleave = () => {
    //             item.goup = false
    //         }
    //     })
    // }
    const childrens = Array.prototype.slice.call(dm.children)
    if (!dm.cl) {
        dm.cl = []
        childrens.forEach((item, i) => {
            dm.cl.push([i, item.offsetLeft, item.offsetWidth])
        })
    }
    const flidx = findFirstLeft(dm.cl, e.clientX)
    const gap = dm.cl.length > 1 ? dm.cl[1][1] - dm.cl[0][1] : 1
    const firstX = dm.cl[flidx][1]
    // console.log(fl)
    // const bg = document.createElement('div')
    // bg.style.cssText = 'position: absolute; height: 100%;top: 0;background-color:rgb(219, 219, 219,0.5);'
    // bg.style.left = fl + 'px'
    // bg.id = 'chooseBg'
    // dm.append(bg)
    dm.mounseIsDown = true
    if (!dm.onmousemove) {
        dm.onmousemove = (e) => {
            if (dm.mounseIsDown) {
                dm.xmove = Math.ceil((e.clientX - firstX) / gap)
                if (dm.xmove + flidx > childrens.length) return
                childrens.forEach(item => item.classList.remove('s-card'))
                for(let i = dm.xmove > 0 ? flidx : dm.xmove + flidx - 1; dm.xmove > 0 ? i < dm.xmove + flidx : i < flidx; i++) {
                    childrens[i].classList.add('s-card')
                }
            }
        }
    }
    if (!dm.onmouseup) {
        dm.onmouseup = (e) => {
            dm.mounseIsDown = false
            dm.onmousemove = null
            childrens.forEach((item, i) => {
                item.onmousemove = null
                item.onmouseleave = null
                const calssList = Array.prototype.slice.call(item.classList)
                if (calssList.includes('s-card')) {
                    calssList.includes('c-card') ? item.classList.remove('c-card') : item.classList.add('c-card')
                }
                item.classList.remove('s-card')
            })
            // const bg = document.getElementById('chooseBg')
            // bg.remove()
        }
    }
    if (!dm.onmouseleave) {
        dm.onmouseleave = (e) => {
            dm.mounseIsDown = false
            dm.onmousemove = null
            childrens.forEach((item, i) => {
                item.onmousemove = null
                item.onmouseleave = null
                item.classList.remove('s-card')
            })
            // const bg = document.getElementById('chooseBg')
            // bg.remove()
        }
    }
    // console.log(mounseDown, e)
}