let plugNsort = function(element) {

    if(!element || element.tagName !== "TABLE") {
        console.error("Não é uma tabela.");
        return;
    }


    this.indexClicked = null;
    this.nullValue = '---';

    let table = element,
        tbody = table.querySelector("tbody"),
        thead = table.querySelector('thead > tr'), //assume que só vai ter um tr no thead.
        rows = tbody.children.length,
        headers = thead.children.length,
        _this = this;

    let sortHandler = function(e) {
        e.stopImmediatePropagation();
        _this.sortTable(e)
    };
    for(let x =0; x < thead.children.length;x++){
        thead.children[x].addEventListener('click',sortHandler);
    }

    this.sortTable = function (e) {
        let el = e.target,
            dataset = el.dataset,
            type = el.getAttribute('data-type');
        _this.indexClicked = el.cellIndex;
        //@todo adicionar tipo dos valores na th clicada.

        let ord = dataset.ord;
        if(!ord) {
            ord =  "ASC";
            el.setAttribute('data-ord','DESC');
        }

        if(ord === 'ASC'){
            el.setAttribute('data-ord','DESC');
        }else{
            el.setAttribute('data-ord','ASC');
        }


        let vals = _this.getColumnValues(type);
        _this.sortValues(vals,ord,type);
        let fragment = _this.getFragment(vals);
        tbody.appendChild( fragment  )
    }


    this.getColumnValues = function(type) {
        let rowLocations = [ ],
            indexClicked = this.indexClicked;
        for(let l = 0; l < rows;l++){
            let line = tbody.children[l],
                cells = line.cells,
                lenCells = cells.length;
            let targetValue = cells.item(indexClicked),
                cellValue = targetValue.innerHTML,
                dataset = targetValue.dataset;

            cellValue = cellValue.trim();
            switch(type){
                case 'int':
                    if (cellValue === _this.nullValue){
                        cellValue = null;
                    }else{
                        cellValue = parseInt(cellValue);
                    }
                    break;
                default:
                    break;
            }
            rowLocations.push( { valor:cellValue,linha:line.rowIndex,element: line }  );
        }

        return rowLocations;
    }

    this.sortValues = function(data,ord,type) {
        let sortAlgo = null;
        if (type === 'int'){
            sortAlgo = function(a,b) {
                return a.valor < b.valor;
            }

            if(ord === 'DESC'){
                sortAlgo = function(a,b) {
                    return a.valor > b.valor;
                }
            }
        }else if(type === 'str'){
            sortAlgo = function (a,b){
                return a.valor.localeCompare(b.valor);
            }

            if (ord === 'DESC'){
                sortAlgo = function (a,b) {
                    return b.valor.localeCompare(a.valor);
                }
            }
        }

        data.sort(sortAlgo);

    }

    this.sortString = function letterSort(lang, letters) {
        letters.sort(new Intl.Collator(lang).compare);
        return letters;
    }

    this.getFragment = function(rowLocations) {
        let frag = document.createDocumentFragment();
        // console.log(rowLocations);
        for(let l = 0;l < rows;l++){
            frag.appendChild(rowLocations[l].element);
        }
        return frag;
    }

}