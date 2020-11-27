Vue.component('v-select', VueSelect.VueSelect);
var itemInfo = new Vue({
    el: '#itemInfo',
    data: {
        selectedGroup: '',
        selectedBin: null,
        selectedUnit: null,
        groups: [],
        bins: [],
        uoms: [],
        itemCode: '',
        price: null,
        discription: '',
        selectedExpiry: null,
        currentDate: new Date().toISOString().slice(0, 10),
        status: new Boolean(true),
        selectedGroupId: null,
        selectedUnitId: null,
        selectedBinId: null,
        isAvailable: null,
        responseMessage: '',
        submitted: false,
        post: Vue.observable(),
    },
    created: function () {
        //this.LoadBaseInfo();
        this.loadGroups();
        //this.loadBins();
        //this.loadUoms();
    },
    mounted: function () {
        console.log('Mounted baseinfo');
        //this.loadGroups();
    },
    updated: function () {
        console.log('Updated baseinfo');
    },
    computed: {
    },
    methods: {
        onChange: function (event) {
            this.selectedGroupId = event.target.value;
            console.log(this.selectedGroup);
        },
        //loadGroups: function () {
        //    let item = {};
        //    $.ajax({
        //        type: "POST",
        //        url: '/api/AirlineSupplierApi/GroupLookup',
        //        success: function (data) {
        //            for (var i = 0; i < data.length; i++) {
        //                this.groups[] = [{
        //                    airlineSupplierId: data[i].airlineSupplierId, 
        //                    airlineSupplierCode: data[i].airlineSupplierCode,
        //                    airlineSupplierName: data[i].airlineSupplierName 
        //                }];
        //            }
                   
        //            console.log(this.groups);
        //        }
        //    });
        //},
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
            console.log(this.selectedBin);
        },
        //loadBins: function () {
        //    axios({
        //        method: 'POST',
        //        url: '/api/BinApi/GetBinInfo'
        //    }).then(res => {
        //        console.log(res.data);
        //        this.bins = res.data;
        //    }).catch(function (error) {
        //        console.log(error);
        //    });
        //},
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
            this.selectedUom = event.target.value;
            console.log(this.selectedUom);
        },
        //loadUoms: function () {
        //    axios({
        //        method: 'POST',
        //        url: '/api/UomApi/GetUomInfo'
        //    }).then(res => {
        //        //console.log(res.data);
        //        this.uoms = res.data;
        //    }).catch(function (error) {
        //        console.log(error);
        //    });
        //},
        fuseSearch_uom(options, search) {
            const fuse = new Fuse(options, {
                keys: ["uomCode", "uomName"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        save: function (event) {
            this.submitted = true;
            let expiry = Boolean(this.selectedExpiry);
            let Min_Stock = 100;
            const { itemCode, selectedGroup, selectedUnit, selectedExpiry, discription, selectedBin} = this;
            if (itemCode && selectedGroup && selectedUnit && selectedExpiry && discription && selectedBin) {
                $.ajax({
                    method: 'POST',
                    url: '/api/ItemApi/SetItemInfo',
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
                }).done(function (result) {
                    $('button[id^="btn"]').prop('disabled', true);
                    swal({
                        title: "Item Saved !",
                        text: this.itemCode + ' is successfully created',
                        icon: "success",
                    })
                        .then((Proceed) => {
                            if (Proceed) {
                                window.location.href = '/Item/AddItem';
                            } else {
                                swal("Ignored the Request !");
                            }
                        });
                }).fail(function (error) {
                    console.log(error);
                });
             
            }
        },
        checkItemCode: function () {
            var code = this.itemCode.trim();
            console.log(code)
            if (code != '') {

                axios({
                    method: 'POST',
                    url: '/api/ItemApi/ValidateItemCode',
                    data: {
                        "ItemCode": this.ItemCode
                    }
                }).then(res => {
                    console.log(res.data);
                    this.isAvailable = res.data;
                    if (res.data != 0) {
                        this.responseMessage = "Item Code is Available.";
                    } else {
                        this.responseMessage = "Item Code is not Available.";
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                this.responseMessage = "";
            }

        },

    }
});

