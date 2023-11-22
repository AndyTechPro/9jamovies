import {format} from "date-fns"
import { Link } from "react-router-dom";

export default function Post({_id,title,cover,createdAt}) {

  
    return(
      <div className='Post_card'>
      <Link to={`/post/${_id}`} className='post_card_link'>
                  <div>
                  <img src={`http://localhost:4000/${cover}`} alt="cover" />
                  </div>
                  <div>
                  <h3 className='post_card_title'>{title}</h3>
                  </div>
                  <p className='post_card_date'>published on <time>{format(new Date(createdAt), 'MMM d, yyyy')}</time></p>
                  
                </Link>
      
          </div>         

              
    );
}
