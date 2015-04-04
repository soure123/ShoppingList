package de.klem.shopping.article;

import org.springframework.data.repository.CrudRepository;

/**
 * Created by Yannic on 03.04.2015.
 */
public interface ArticleRepository extends CrudRepository<Article, Long> {
}
