export default function LoadMore({ nextPage, loadMore }) {
    return (
        <button onClick={loadMore} className="load-more-button">
            Load More
        </button>
    );
}
