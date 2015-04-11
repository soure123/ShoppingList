package de.klem.shopping.config;

import de.klem.shopping.article.Article;
import de.klem.shopping.list.item.ShoppingItem;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.http.MediaType;

import java.net.URI;

/**
 * Created by Yannic on 03.04.2015.
 */
@Configuration
public class MyRepositoryRestMvcConfiguration extends RepositoryRestMvcConfiguration {

    private static final String MY_BASE_URI_URI = "/api";

    @Override
    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        super.configureRepositoryRestConfiguration(config);
        config.setBaseUri(URI.create(MY_BASE_URI_URI));
        config.exposeIdsFor(ShoppingItem.class, Article.class);
        config.setReturnBodyOnCreate(true);
    }
}