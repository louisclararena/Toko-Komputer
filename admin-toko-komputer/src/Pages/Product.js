import React from "react"
import Navbar from "../component/Navbar"
import ProductList from "../component/ProductList"
import { base_url, product_image_url } from "../Config.js";
import $ from "jquery"
import axios from "axios"

class Product extends React.Component {
    constructor(){
        super()
        this.state = {
            products: [],
            token: "",
            action: "",
            name: "",
            price: 0,
            stock: 0,
            image: "",
            uploadFile: true,
            product_id: ""
        }

        /* 
        logika ini digunakan --> untuk mengecek apakah user yg mengakses telah
        melakukan login sebagai admin atau belum.
        Karena hal. admin tidak boleh diakses sembarang user
        */
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)
    }

    /**
     * arrow function header config --> untuk memberikan header berupa
       'bearer token' sebagai request API sebelum mengakses data
     */
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    /**
     * function getProduct --> untuk mengakses API get product
     */
    getProduct = () => {
        let url = base_url + "/product"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({products: response.data})
        })
        .catch(error => {
            if (error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            }else{
                console.log(error);
            }
        })
    }

    // akses function getProduct pada componentDidMount
    componentDidMount() {
        this.getProduct()
    }

    /* function Add -> untuk memberikan inisialisasi data dan menmapilkan modal
    untuk menambah data
    */
    Add = () => {
        $("#modal_product").modal("show")
        this.setState({
            action: "insert",
            product_id: 0,
            name: "",
            price: 0,
            stock: 0,
            image: null,
            uploadFile: true
        })
    }

    /* function Edit -> untuk memberikan inisialisasi data dan menmapilkan modal
        untuk mengedit data
        */
    Edit = selectedItem => {
        $("#modal_product").modal("show")
        this.setState({
            action: "update",
            product_id: selectedItem.product_id,
            name: selectedItem.name,
            price: selectedItem.price,
            stock: selectedItem.stock,
            image: null,
            uploadFile: false
        })
    }

    // fuction saveProduct -> untuk menyimpan data pada db dg mengakses API
    saveProduct = event => {
        event.preventDefault()
        $("#modal_product").modal("hide")
        let form = new FormData()
        form.append("product_id", this.state.product_id)
        form.append("name", this.state.name)
        form.append("price", this.state.price)
        form.append("stock", this.state.stock)

        if(this.state.uploadFile) {
            form.append("image", this.state.image)
        }

        let url = base_url + "/product"

        if(this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        }
    }

    // function dropProduct -> untuk menghapus data
    dropProduct = selectedItem => {
        if(window.confirm("are you sure qill delete this item ?")) {
            let url = base_url + "/product/" + selectedItem.product_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        }
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">
                        Product List
                    </h3>
                    <div className="row">
                        { this.state.products.map( item => (
                            <ProductList
                                key = {item.product_id}
                                name = {item.name}
                                price = {item.price}
                                stock = {item.stock}
                                image = { product_image_url + "/" + item.image}
                                onEdit = {() => this.Edit(item)}
                                onDrop = {() => this.dropProduct(item)}
                            />
                        )) }
                    </div>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Project
                    </button>
                </div>

                {/* modal product */}
                <div className="modal fade" id="modal_product">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Form Product</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.saveProduct(ev)}>
                                    Product Name
                                    <input type="text" className="form-control mb-1" value={this.state.name}
                                    onChange={ev => this.setState({name: ev.target.value})} required />

                                    Product Stock
                                    <input type="number" className="form-control mb-1" value={this.state.stock}
                                    onChange={ev => this.setState({stock: ev.target.value})} required />

                                    Product Price
                                    <input type="number" className="form-control mb-1" value={this.state.price}
                                    onChange={ev => this.setState({price: ev.target.value})} required />

                                    { this.state.action === "update" && this.state.uploadFile === false ? (
                                        <button className="btn btn-sm btn-dark mb-1 btn-block"
                                        onClick={() => this.setState({uploadFile: true})}>
                                            Change Product Image
                                        </button>
                                    ) : (
                                        <div>
                                            Product Image
                                            <input type="file" className="form-control mb-1"
                                            onChange={ev => this.setState({image: ev.target.files[0]})}
                                            required />
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-block btn-success">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Product;

