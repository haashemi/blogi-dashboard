import { ErrorComponent, RefineThemes, ThemedLayoutV2, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { Authenticated, Refine } from "@refinedev/core";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { authProvider } from "./auth-provider";
import { BlogPostCreate, BlogPostEdit, BlogPostList, BlogPostShow } from "./pages/blog-posts";
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from "./pages/categories";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { resources } from "./resources";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={{ ...RefineThemes.Blue, algorithm: theme.darkAlgorithm }}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            notificationProvider={useNotificationProvider}
            resources={resources}
            routerProvider={routerBindings}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              title: { text: "Blogi" },
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated fallback={<CatchAllNavigate to="/login" />} key="authenticated-inner">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource resource="blog_posts" />} />
                <Route path="/blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route element={<BlogPostCreate />} path="create" />
                  <Route element={<BlogPostEdit />} path="edit/:id" />
                  <Route element={<BlogPostShow />} path="show/:id" />
                </Route>
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route element={<CategoryCreate />} path="create" />
                  <Route element={<CategoryEdit />} path="edit/:id" />
                  <Route element={<CategoryShow />} path="show/:id" />
                </Route>
                <Route element={<ErrorComponent />} path="*" />
              </Route>
              <Route
                element={
                  <Authenticated fallback={<Outlet />} key="authenticated-outer">
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route element={<ForgotPassword />} path="/forgot-password" />
              </Route>
            </Routes>

            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
