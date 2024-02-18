export default function User({user, imagen}) {
    return(
        <div className="userBox">
            <img className="img" src={imagen ? imagen : ''} alt="" />
            <ul>
                <li>{user ? user.username : ''}</li>
                <li style={{fontSize: '14px'}}>{`${user ? user.email.name : ''}@${user ? user.email.servicio : ''}`}</li>
                
            </ul>
        </div>
    )
}