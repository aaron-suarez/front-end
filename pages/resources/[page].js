import { useState } from 'react'; // eslint-disable-line  no-restricted-imports
import PropTypes from 'prop-types';
import Content from 'components/Content/Content';
import Head from 'components/head';
import HeroBanner from 'components/HeroBanner/HeroBanner';
import ResourceCard from 'components/Cards/ResourceCard/ResourceCard';
import Pagination from 'components/Pagination/Pagination';
import { Field, Formik } from 'formik';
import Form from 'components/Form/Form';
import Input from 'components/Form/Input/Input';
import { getResourcesPromise, searchResourcesPromise } from 'common/constants/api';
import styles from '../styles/resources.module.css';

ResourcesPage.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  defaultResources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number, // integer, unique ID
      name: PropTypes.title,
      notes: PropTypes.string, // possibly null
      url: PropTypes.string.isRequired,
      upvotes: PropTypes.number,
      downvotes: PropTypes.number,
    }),
  ).isRequired,
  defaultTotalPages: PropTypes.number.isRequired,
};

ResourcesPage.getInitialProps = async ({ pathname, query }) => {
  const { page = 1 } = query;

  const response = await getResourcesPromise({ page });

  const { data: defaultResources, number_of_pages: defaultTotalPages, page: currentPage } = response.data;

  return {
    currentPage,
    pathname,
    defaultResources,
    defaultTotalPages,
    page
  };
};

function ResourcesPage({ currentPage, pathname, defaultResources, defaultTotalPages, page }) {
  const [resources, setResources] = useState(defaultResources);
  const [totalPages, setTotalPages] = useState(defaultTotalPages);
  // const [pathname, setPathname] = useState(pathname);

  const handleSearch = async (q) => {
    const params = {page: page};
    params.q = q.q;
    const response = await searchResourcesPromise(params);
    setResources(response.data.data);
    setTotalPages(response.data.number_of_pages);
    // setPathname(`${pathname}?q=${q.q}`);
    // pathname = `${pathname}?q=${q.q}`;
  };

  return (
    <>
      <Head title="Resources" />
      <HeroBanner title="Resources" className="smallHero" />
      <Content
        theme="white"
        columns={[
          <Formik
            onSubmit={handleSearch}
          >
            <Form>
              <div className={styles.fullWidth}>
                <Field
                  type="search"
                  name="q"
                  label="Search"
                  component={Input}
                />
              </div>
            </Form>
          </Formik>,
          <section className={styles.fullWidth}>
            <div className={styles.fullWidth}>
              {resources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  description={resource.notes}
                  downvotes={resource.downvotes}
                  upvotes={resource.upvotes}
                  href={resource.url || ''}
                  name={resource.name}
                  className={styles.resourceCard}
                />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} pathname={pathname} />
          </section>,
        ]}
      />
    </>
  );
}

export default ResourcesPage;
