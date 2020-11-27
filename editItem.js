Vue.component('v-select', VueSelect.VueSelect);
var editItemInfo = new Vue({
    el: '#editItemInfo',
    data: {
        selectedGroup: null,
        groups: [],
        items: [],
        bins: [],
        uoms: [],
        itemCode: '',
        price: null,
        discription: '',
        selectedUnit: null,
        selectedBin: null,
        selectedExpiry: null,
        selectedActive: null,
        currentDate: new Date().toISOString().slice(0, 10),
        status: null,
        selectedGroupId: null,
        selectedUnitId: null,
        selectedBinId: null,
        submitted: false
    },
    created: function () {
        //this.LoadBaseInfo();
        this.loadGroups();
        this.items;
        this.loadBins();
        this.loadUoms();
       
    },
    mounted: function () {
        console.log('Mounted editItemInfo');
        //this.loadGroups();
    },
    updated: function () {
        console.log('Updated editItemInfo');
    },
    methods: {
        onChange: function (event) {
            //this.selectedGroupId = this.selectedGroup.airlineSupplierId;
            this.selectedGroup = event.target.value;
        },
        loadGroups: function () {
            //axios({
            //    method: 'POST',
            //    url: '/api/AirlineSupplierApi/GroupLookup'
            //}).then(res => {
            //    //console.log(res.data);
            //    this.groups = res.data;
            //    console.log(this.groups.airlineSupplierName);
            //}).catch(function (error) {
            //    console.log(error);
            //});
            //$.ajax({
            //    method: "POST",
            //    url: '/api/AirlineSupplierApi/GroupLookup'
            //})
            //    .then(function (result) {
            //        let item = {
            //                airlineSupplierCode:"UL",
            //                airlineSupplierId: 1,
            //                airlineSupplierName: "SRI LAnkan",
            //                airlineSupplierStatus: true
            //        }
            //        for (var i = 0; i < item.length; i++) {
            //            this.groups.push(item);
            //        }
            //        console.log(this.groups);
            //    })
            //    .fail(function (result) {
            //        alert(result);
            //    });
            //     let item = [];
            $.ajax({
                type: "POST",
                url: '/api/AirlineSupplierApi/GroupLookup',
                success: function (data) {
                    this.groups = data;
                    //for (var i = 0; i < data.length; i++) {
                    //    this.groups = [{
                    //        airlineSupplierId: data[i].airlineSupplierId, 
                    //        airlineSupplierCode: data[i].airlineSupplierCode,
                    //        airlineSupplierName: data[i].airlineSupplierName 
                    //    }];
                     
                    //}
                    console.log(this.groups);
                }
            });

        },
        fuseSearch_group(options, search) {
            const fuse = new Fuse(options, {
                keys: ["airlineSupplierCode", "airlineSupplierName"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        onChangeBin: function (event) {
            this.selectedBin = event.target.value;
        },
        loadBins: function () {
            axios({
                method: 'POST',
                url: '/api/BinApi/GetBinInfo'
            }).then(res => {
                //console.log(res.data);
                this.bins = res.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        fuseSearch_bin(options, search) {
            const fuse = new Fuse(options, {
                keys: ["binCode", "binDescription"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        onChangeUom: function (event) {
            //this.selectedUnitId = this.selectedUnit.uomId;
            this.selectedUnit = event.target.value;
        },
        loadUoms: function () {
            axios({
                method: 'POST',
                url: '/api/UomApi/GetUomInfo'
            }).then(res => {
                console.log(res.data);
                this.uoms = res.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        fuseSearch_uom(options, search) {
            const fuse = new Fuse(options, {
                keys: ["uomCode", "uomName"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        update: function () {
            this.submitted = true;
            let expiry = Boolean(this.selectedExpiry);
            let Min_Stock = 100;
            const { itemCode, selectedGroup, selectedUnit, selectedBin, selectedExpiry, discription, status } = this;
            if (itemCode) {
                axios({
                    method: 'POST',
                    url: '/api/Item/Update',
                    data: {
                        "ItemCode": this.itemCode,
                        "UomId": parseInt(this.selectedUnit),
                        "Status": this.status,
                        "ItemDecsiption": this.discription,
                        "BinId": parseInt(this.selectedBin),
                        "IsExpiry": expiry,
                        "MinStock": parseFloat(Min_Stock),
                        "AirlineSupplierId": parseInt(this.selectedGroup)
                    }
                }).then(res => {
                    //console.log(res.data);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }

    }
});