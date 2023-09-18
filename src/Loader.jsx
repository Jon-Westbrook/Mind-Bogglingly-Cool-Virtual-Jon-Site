import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';

function Loader({ onUnmount }) {
	const { progress } = useProgress();
	useEffect(() => {
		if (Math.round(progress) === 100) {
			return () => {
				onUnmount && onUnmount();
  
			};
		}
	}, [onUnmount, progress]);
	return (
		<div className="loader-container">
			<div className="loader">
				<div className="progress-bar">
					<div className="progress" style={{ width: `${Math.round(progress)}%` }} />
					<div className="loading-text" style={{ marginTop: '20px' }}>Yes, it&rsquo;s big...{Math.round(progress)}%</div>
				</div>
			</div>
		</div>
	);
}

export default Loader;
