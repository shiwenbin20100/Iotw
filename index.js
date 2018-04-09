window.onload = function () {

    document.body.addEventListener("touchstart",function (ev) {
        ev.preventDefault();
    },{passive:false});
    document.body.addEventListener("touchmove",function (ev) {
        ev.preventDefault();
    },{passive:false});


    let globalFS = parseInt(document.getElementsByTagName("html")[0].style.fontSize);

    let header = document.getElementById("header");
    let headerTitle = header.getElementsByClassName("header_Title")[0];
    let headerSearch = header.getElementsByClassName("header_Search")[0];

    let body = document.getElementById("body");

    let slideBar = document.getElementById("slideBar");
    let slideUl = slideBar.getElementsByTagName("ul")[0];
    let slideLi = slideBar.getElementsByTagName("li");

    let backBtn = document.getElementsByClassName("backtoTop")[0];

    let slideisMove = false;
    const pointRecorder = [0,0];
    let val;
    let dY;
    let speed;

    slideMove(slideLi).init();
    bodyMove().init();

    backBtn.addEventListener("touchstart",function(){
        body.style.transition = ".5s";
        let nowScrollTop = body.style.transform.match(/translateY\(([-]?.+)px\)/)[1];
        if(nowScrollTop >= 0) return;
        body.style.transform = "translateY(0)";
    })


    function slideMove(ele) {
        let liWidth = ele[0].offsetWidth;
        function init() {
            setIndex();
            setPosition();
            setTouchMovement();
        }
        function setIndex() {
            for(let i=0;i<ele.length;i++){
                ele[i].index = i;
            }
        }
        function setPosition() {
            let liLength = ele.length;
            for(let i=0;i<ele.length;i++){
                ele[i].style.transform = "translateX("+(i * liWidth)+"px)";
            }
            let prevLi = document.createElement("li");
            let prevPic = document.createElement("img");
            prevPic.src = ele[liLength - 1].children[0].src;
            prevLi.append(prevPic);
            prevLi.style.transform = "translateX("+(-liWidth)+"px)";
            slideUl.insertBefore(prevLi,slideUl.children[0]);
            let nextLi = document.createElement("li");
            let nextPic = document.createElement("img");
            nextPic.src = ele[1].children[0].src;
            nextLi.append(nextPic);
            nextLi.style.transform = "translateX("+(liLength * liWidth)+"px)";
            slideUl.append(nextLi);
        }
        function setTouchMovement() {
            let isMove;
            let startX;
            let startY;
            let startPositionX;
            slideUl.addEventListener("touchstart",function (ev) {
                if(this.style.transform == "translateX("+liWidth+"px)"){
                    this.style.transform = "translateX(-"+((ele.length-3) * liWidth)+"px)"
                }else if(this.style.transform == "translateX("+(-liWidth* (ele.length - 2))+"px)"){
                    this.style.transform = "translateX(0px)"
                }
                isMove = true;
                slideisMove = true;
                slideUl.style.transition = "none";
                startX = ev.changedTouches[0].pageX;
                startY = ev.changedTouches[0].pageY;
                startPositionX = this.getBoundingClientRect().left;
             })
                slideUl.addEventListener("touchmove",function (ev) {
                    let disX = ev.changedTouches[0].pageX - startX;
                    let disY = ev.changedTouches[0].pageY - startY;
                    if(Math.abs(disY) > Math.abs(disX)) {
					isMove = false;
				    }
                    if(isMove){
                        slideUl.style.transform = "translateX("+(startPositionX+disX)+"px)";
                        }
                    })
                    slideUl.addEventListener("touchend",function (ev) {
                        slideisMove = false;
                        let endX = ev.changedTouches[0].pageX;
                        if(endX - startX >= 200){
                            disX = liWidth;
                        }else if(endX - startX <= -200){
                            disX = -liWidth
                        }else {
                            disX = 0;
                        }
                        slideUl.style.transition = ".3s cubic-bezier(.42, 0, .58, 1)";
                        slideUl.style.transform = "translateX("+(startPositionX+disX)+"px)";
                })




        }
        return {
            init
        }
    }

    function bodyMove() {
        function init() {
            setMovement();
        }
        function setMovement() {
            body.style.transform = "translateY(0)";
            let shrinkHeight;
            let isTop;
            body.addEventListener("touchstart",function (ev) {
                ev.stopPropagation();
                dY = 0;
                speed = 0;
                body.style.transition = "none";
                headerTitle.style.transition = "none";
                header.style.transition = "none";
                headerSearch.style.transition = "none";
                let startTransY = body.style.transform.match(/translateY\(([-]?.+)px\)/);
                let startTransTop = parseInt(startTransY[1]);
                let startY = ev.changedTouches[0].pageY;
                isTop = body.getBoundingClientRect().top + 50 >0?true:false;
                body.addEventListener("touchmove",function (e) {

                    if(slideisMove) return;
                    if(startTransTop < -350 && !isTop){
                        changeTitle();
                    }
                    shrinkHeight = document.body.getBoundingClientRect().height - document.documentElement.clientHeight - header.offsetHeight;
                    let nowY = e.changedTouches[0].pageY;
                    pointRecorder[0] = nowY;
                    val = nowY - startY;
                    if((startTransTop == 0 && val > 0) || (Math.abs(startTransTop) >= shrinkHeight - 100 && val < 0)){
                        val = val/3;
                    }
                    speed = val*1.2;
                    body.style.transform = "translateY("+((startTransTop + val+ speed/4))+"px)";
                })
                body.addEventListener("touchend",function (ev) {
                    ev.stopPropagation();
                    pointRecorder[1] = ev.changedTouches[0].pageY;
                    let endTransY = body.style.transform.match(/translateY\(([-]?.+)px\)/);
                    dY = pointRecorder[1] - pointRecorder[0];
                    let endTransTop = parseInt(endTransY[1]);
                    if(endTransY){
                        if(endTransTop > 0){
                            showTitle();
                            endTransTop = 0;
                            body.style.transition = ".3s";
                            body.style.transform = "translateY("+(endTransTop)+"px)";
                    }else if(Math.abs(endTransTop) > shrinkHeight){
                            endTransTop = shrinkHeight;
                            body.style.transition = ".3s";
                            body.style.transform = "translateY("+(-endTransTop)+"px)";
                        }else {
                            body.style.transition = ".2s";

                            if(dY <= 0){
                                body.style.transform = "translateY("+(endTransTop + dY /50)+"px)";
                            }else {
                                body.style.transform = "translateY("+(endTransTop + dY /50)+"px)";
                            }
                         }
                    }

                })
            })
        }
        function changeTitle() {
            header.style.transition = ".4s linear";
            headerTitle.style.transition = ".4s linear";
            headerSearch.style.transition = ".4s linear";
            header.style.height = (76/64)+"rem";
            headerTitle.style.top = -80+"px";
            headerSearch.style.left = "50%";
            headerSearch.style.transform = "translateX(-50%)";
            headerSearch.style.width = "60%";
        }
        function showTitle() {
            header.style.height = (132/64)+"rem";
            headerTitle.style.top = "0";
            headerSearch.style.width = "9.375rem";
            headerSearch.style.left = "3%";
            headerSearch.style.transform = "translateX(0)";

        }
        return {
            init
        }
    }




}