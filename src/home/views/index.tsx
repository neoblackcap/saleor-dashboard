import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import React from "react";

import { getUserName, maybe } from "../../misc";
import { orderListUrl } from "../../orders/urls";
import { productListUrl, productVariantEditUrl } from "../../products/urls";
import { OrderStatusFilter, StockAvailability } from "../../types/globalTypes";
import HomePage from "../components/HomePage";
import { useHomePage } from "../queries";

const HomeSection = () => {
  const navigate = useNavigator();
  const { user } = useUser();
  const { channel } = useAppChannel();

  const { data } = useHomePage({
    displayLoader: true,
    variables: { channel: channel.slug }
  });

  return (
    <HomePage
      activities={maybe(() =>
        data.activities.edges.map(edge => edge.node).reverse()
      )}
      orders={maybe(() => data.ordersToday.totalCount)}
      sales={maybe(() => data.salesToday.gross)}
      topProducts={maybe(() =>
        data.productTopToday.edges.map(edge => edge.node)
      )}
      onProductClick={(productId, variantId) =>
        navigate(productVariantEditUrl(productId, variantId))
      }
      onOrdersToCaptureClick={() =>
        navigate(
          orderListUrl({
            status: [OrderStatusFilter.READY_TO_CAPTURE]
          })
        )
      }
      onOrdersToFulfillClick={() =>
        navigate(
          orderListUrl({
            status: [OrderStatusFilter.READY_TO_FULFILL]
          })
        )
      }
      onProductsOutOfStockClick={() =>
        navigate(
          productListUrl({
            stockStatus: StockAvailability.OUT_OF_STOCK
          })
        )
      }
      ordersToCapture={maybe(() => data.ordersToCapture.totalCount)}
      ordersToFulfill={maybe(() => data.ordersToFulfill.totalCount)}
      productsOutOfStock={maybe(() => data.productsOutOfStock.totalCount)}
      userName={getUserName(user, true)}
      userPermissions={user?.userPermissions || []}
    />
  );
};

export default HomeSection;
