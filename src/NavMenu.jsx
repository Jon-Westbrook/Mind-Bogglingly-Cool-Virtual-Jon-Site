
import { Link } from 'react-router-dom';

function NavMenu({ pageList, currentPage }) {
	return (
		<ul className="nav ">
			{pageList.map((page) => (
				<li key={page.url}>
					<Link
						to={`/${page.url}`}
						className={currentPage === page.url ? 'active-link' : ''}
					>
						{page['link-copy']}
					</Link>
				</li>
			))}
		</ul>
	);
}

export default NavMenu;
