import "./topbar.css"
import { Search } from "@material-ui/icons"
import { Link } from "react-router-dom"
import { useContext, useState, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Dropdown, Modal } from 'react-bootstrap'
import { CircularProgress } from "@material-ui/core";
import axios from "axios"

export default function Topbar() {

    const { user } = useContext(AuthContext)
    const [infoModal, setInfoModal] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchContent, setSearchContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [textInfoModal, setTextInfoModal] = useState('');
    const [modal, setModal] = useState(false);
    const firstName = useRef()
    const lastName = useRef()
    const desc = useRef()
    const country = useRef()
    const city = useRef()
    const name = useRef()
    const searchTerm = useRef()

    const logout = () => {
        localStorage.clear();
        window.location.reload()
    }

    const handleEditProfile = (e) => {
        e.preventDefault();
        setLoading(true)
        const editProfileCall = async (values) => {
            const response = await axios.post("http://api.local:9902/user/editInfo", values)
            if (response.data.success === true) {
                setLoading(false)
                localStorage.setItem("user", JSON.stringify(response.data.user))
                window.location.reload()
            } else {
                setLoading(false)
                setModal(false)
                setTextInfoModal('The changes could not be saved!')
                setInfoModal(true)
            }
        }
        const values = user.type === 'Learner' ?
            {
                userId: user.id,
                type: user.type,
                firstName: firstName.current.value,
                lastName: lastName.current.value,
                description: desc.current.value,
                city: city.current.value,
                country: country.current.value
            }
            :
            {
                userId: user.id,
                type: user.type,
                name: name.current.value,
                description: desc.current.value,
                city: city.current.value,
                country: country.current.value
            }
        console.log(values)
        editProfileCall(values)
    }

    const searchUser = () => {
        const value = searchTerm.current.value
        if (value !== '') {
            setSearchContent(<CircularProgress size="40px" />)
            setSearch(true)
            setTimeout(() => {
                if (value === searchTerm.current.value) {
                    const searchCall = async () => {
                        const response = await axios.get("http://api.local:9904/search/" + value)
                        if (response.data.success === true) {
                            if(response.data.users.length !== 0) {
                                const html = response.data.users.map(element => (
                                    <Link to={`/profile/${element.type}/${element.id}`} key={element.id + element.type} className="userSearchLink">
                                        <div className="userSearch">
                                            <img src={element.profileImg} alt="" className="userSearchImg" />
                                            {element.hasOwnProperty('firstName') ? element.firstName + ' ' + element.lastName : element.name}
                                        </div>
                                    </Link>
                                ))
        
                                setSearchContent(html)
                            } else {
                                setSearchContent('No match was found for the specified search criteria')
                            }
                        }
                    }
                    searchCall()
                }
            }, 300);
        } else {
            setSearchContent('')
            setSearch(false)
        }
    }

    const closeSearch = (event) => {
        if (event.relatedTarget === null || event.relatedTarget.className !== "userSearchLink") {
            setSearch(false)
            setSearchContent('')
        }
    }
    const handleShowModal = () => setModal(true);
    const handleCloseModal = () => setModal(false);
    const handleCloseInfoModal = () => setInfoModal(false);


    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <div className="logo"><img src="/assets/logo.png" alt="logo" /></div>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input placeholder="Search a friend or a school"
                        className="searchInput"
                        ref={searchTerm}
                        onKeyUp={searchUser}
                        onBlur={(e) => closeSearch(e)}
                    />
                    {search ?
                        <div className="autocom-box">
                            {searchContent}
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <div className="topbarRight">
                <div className="topBarLinks">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span className="topbarLink">Homepage</span>
                    </Link>
                </div>
                <Link to={`/profile/${user.type}/${user.id}`} className="profileLink">
                    {user.hasOwnProperty('firstName') ? user.firstName : user.name} <img src={user.profileImg} alt="" className="topbarImg" />
                </Link>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown" className="moreProfile">
                        More
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleShowModal}>
                            Edit your profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={logout}>
                            Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <Modal show={modal} onHide={handleCloseModal} size="lg">
                {!loading ?
                    <div>
                        <Modal.Header className="text-center" closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Edit profile
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {user.type === 'Learner' ?
                                <div>
                                    <div className="form-group row">
                                        <label htmlFor="firstName" className="col-sm-2 col-form-label">First name</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="firstName" defaultValue={user.firstName} ref={firstName} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="lastName" className="col-sm-2 col-form-label">Last name</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="lastName" defaultValue={user.lastName} ref={lastName} />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="name" defaultValue={user.name} ref={name} />
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label htmlFor="desc" className="col-sm-2 col-form-label">Description</label>
                                <div className="col-sm-10">
                                    <textarea type="text" className="form-control desc" id="Description" maxLength='150' defaultValue={user.description} ref={desc}>
                                    </textarea>
                                    <small className="form-text text-muted">Maximum 150 characters</small>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="country" className="col-sm-2 col-form-label">Country/State</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="country" defaultValue={user.country} ref={country} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="city" className="col-sm-2 col-form-label">City</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="city" defaultValue={user.city} ref={city} />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleEditProfile} className="btn btn-primary">
                                Save
                            </button>
                            <button onClick={handleCloseModal} className="btn btn-danger">
                                Close
                            </button>
                        </Modal.Footer>
                    </div>
                    :
                    <Modal.Body className="text-center"><CircularProgress size="40px" /></Modal.Body>
                }
            </Modal>

            <Modal show={infoModal} onHide={handleCloseInfoModal}>
                <Modal.Header closeButton>Error</Modal.Header>
                <Modal.Body className="text-danger">{textInfoModal}</Modal.Body>
            </Modal>

        </div>
    )
}
