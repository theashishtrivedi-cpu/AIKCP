SET local check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.current_user_role()
  RETURNS public.user_role
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select role
    from public.profiles
    where id = auth.uid()
    limit 1;
$function$;

CREATE OR REPLACE FUNCTION public.current_user_status()
  RETURNS public.user_status
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select status
    from public.profiles
    where id = auth.uid()
    limit 1;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select coalesce(public.current_user_role() = 'admin', false);
$function$;

CREATE OR REPLACE FUNCTION public.is_authenticated_user()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select auth.uid() is not null;
$function$;

CREATE OR REPLACE FUNCTION public.is_editor()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select coalesce(
        public.current_user_role() in ('editor', 'moderator', 'admin'),
        false
    );
$function$;

CREATE OR REPLACE FUNCTION public.is_moderator()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select coalesce(
        public.current_user_role() in ('moderator', 'admin'),
        false
    );
$function$;

CREATE OR REPLACE FUNCTION public.is_write_allowed()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
    select coalesce(
        public.current_user_status() = 'active',
        false
    );
$function$;

CREATE POLICY "answers_delete_owner_moderator_admin" ON "public"."answers"
  FOR DELETE
  TO "authenticated"
  USING (((author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "answers_insert_user" ON "public"."answers"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_authenticated_user() AND public.is_write_allowed() AND (author_id = auth.uid())));

CREATE POLICY "answers_select_authenticated" ON "public"."answers"
  FOR SELECT
  TO "authenticated"
  USING (((status = 'published'::public.content_status) OR (author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "answers_update_owner_moderator_admin" ON "public"."answers"
  FOR UPDATE
  TO "authenticated"
  USING ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()))
  WITH CHECK ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()));

CREATE POLICY "articles_delete_moderator_admin" ON "public"."articles"
  FOR DELETE
  TO "authenticated"
  USING (public.is_moderator());

CREATE POLICY "articles_insert_editor" ON "public"."articles"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_editor() AND public.is_write_allowed() AND (author_id = auth.uid())));

CREATE POLICY "articles_select_authenticated" ON "public"."articles"
  FOR SELECT
  TO "authenticated"
  USING (((status = 'published'::public.content_status) OR (author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "articles_update_owner_moderator_admin" ON "public"."articles"
  FOR UPDATE
  TO "authenticated"
  USING ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()))
  WITH CHECK ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()));

CREATE POLICY "audit_logs_select_admin" ON "public"."audit_logs"
  FOR SELECT
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "board_content_delete_moderator_admin" ON "public"."board_content"
  FOR DELETE
  TO "authenticated"
  USING (public.is_moderator());

CREATE POLICY "board_content_insert_editor" ON "public"."board_content"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_editor() AND public.is_write_allowed() AND (author_id = auth.uid())));

CREATE POLICY "board_content_select_authenticated" ON "public"."board_content"
  FOR SELECT
  TO "authenticated"
  USING (((status = 'published'::public.content_status) OR (author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "board_content_update_owner_moderator_admin" ON "public"."board_content"
  FOR UPDATE
  TO "authenticated"
  USING ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()))
  WITH CHECK ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()));

CREATE POLICY "board_sections_delete_admin" ON "public"."board_sections"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "board_sections_insert_admin" ON "public"."board_sections"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "board_sections_select_authenticated" ON "public"."board_sections"
  FOR SELECT
  TO "authenticated"
  USING (((is_active = true) OR public.is_admin()));

CREATE POLICY "board_sections_update_admin" ON "public"."board_sections"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "board_translations_delete_moderator_admin" ON "public"."board_translations"
  FOR DELETE
  TO "authenticated"
  USING (public.is_moderator());

CREATE POLICY "board_translations_insert_editor" ON "public"."board_translations"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_editor() AND public.is_write_allowed() AND (EXISTS ( SELECT 1
   FROM public.board_content bc
  WHERE ((bc.id = board_translations.content_id) AND (bc.author_id = auth.uid()))))));

CREATE POLICY "board_translations_select_authenticated" ON "public"."board_translations"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.board_content bc
  WHERE ((bc.id = board_translations.content_id) AND ((bc.status = 'published'::public.content_status) OR (bc.author_id = auth.uid()) OR public.is_moderator())))));

CREATE POLICY "board_translations_update_owner_moderator_admin" ON "public"."board_translations"
  FOR UPDATE
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.board_content bc
  WHERE ((bc.id = board_translations.content_id) AND (((bc.author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator())))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.board_content bc
  WHERE ((bc.id = board_translations.content_id) AND (((bc.author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator())))));

CREATE POLICY "bookmarks_delete_owner" ON "public"."bookmarks"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "bookmarks_insert_owner" ON "public"."bookmarks"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_write_allowed() AND (user_id = auth.uid())));

CREATE POLICY "bookmarks_select_owner" ON "public"."bookmarks"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "bookmarks_update_owner" ON "public"."bookmarks"
  FOR UPDATE
  TO "authenticated"
  USING (((user_id = auth.uid()) AND public.is_write_allowed()))
  WITH CHECK (((user_id = auth.uid()) AND public.is_write_allowed()));

CREATE POLICY "categories_delete_admin" ON "public"."categories"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "categories_insert_admin" ON "public"."categories"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_select_active" ON "public"."categories"
  FOR SELECT
  TO "authenticated"
  USING (((is_active = true) OR public.is_admin()));

CREATE POLICY "categories_update_admin" ON "public"."categories"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "comments_delete_owner_moderator_admin" ON "public"."comments"
  FOR DELETE
  TO "authenticated"
  USING (((author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "comments_insert_user" ON "public"."comments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_authenticated_user() AND public.is_write_allowed() AND (author_id = auth.uid())));

CREATE POLICY "comments_select_authenticated" ON "public"."comments"
  FOR SELECT
  TO "authenticated"
  USING (((status = 'published'::public.content_status) OR (author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "comments_update_owner_moderator_admin" ON "public"."comments"
  FOR UPDATE
  TO "authenticated"
  USING ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()))
  WITH CHECK ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()));

CREATE POLICY "current_affairs_delete_moderator_admin" ON "public"."current_affairs"
  FOR DELETE
  TO "authenticated"
  USING (public.is_moderator());

CREATE POLICY "current_affairs_insert_moderator_admin" ON "public"."current_affairs"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_moderator() AND public.is_write_allowed()));

CREATE POLICY "current_affairs_select_authenticated" ON "public"."current_affairs"
  FOR SELECT
  TO "authenticated"
  USING (((status = 'published'::public.content_status) OR public.is_moderator()));

CREATE POLICY "current_affairs_update_moderator_admin" ON "public"."current_affairs"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_moderator())
  WITH CHECK (public.is_moderator());

CREATE POLICY "moderation_results_delete_admin" ON "public"."moderation_results"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "moderation_results_insert_moderator_admin" ON "public"."moderation_results"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_moderator());

CREATE POLICY "moderation_results_select_moderator_admin" ON "public"."moderation_results"
  FOR SELECT
  TO "authenticated"
  USING (public.is_moderator());

CREATE POLICY "moderation_results_update_moderator_admin" ON "public"."moderation_results"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_moderator())
  WITH CHECK (public.is_moderator());

CREATE POLICY "news_sources_delete_admin" ON "public"."news_sources"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "news_sources_insert_admin" ON "public"."news_sources"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "news_sources_select_active" ON "public"."news_sources"
  FOR SELECT
  TO "authenticated"
  USING (((is_active = true) OR public.is_admin()));

CREATE POLICY "news_sources_update_admin" ON "public"."news_sources"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "notifications_delete_recipient_admin" ON "public"."notifications"
  FOR DELETE
  TO "authenticated"
  USING (((user_id = auth.uid()) OR public.is_admin()));

CREATE POLICY "notifications_insert_system_admin" ON "public"."notifications"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "notifications_select_recipient_admin" ON "public"."notifications"
  FOR SELECT
  TO "authenticated"
  USING (((user_id = auth.uid()) OR public.is_admin()));

CREATE POLICY "notifications_update_recipient_admin" ON "public"."notifications"
  FOR UPDATE
  TO "authenticated"
  USING (((user_id = auth.uid()) OR public.is_admin()))
  WITH CHECK (((user_id = auth.uid()) OR public.is_admin()));

CREATE POLICY "profiles_select_authenticated" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING (((auth.uid() = id) OR public.is_admin()));

CREATE POLICY "questions_delete_moderator_admin" ON "public"."questions"
  FOR DELETE
  TO "authenticated"
  USING (public.is_moderator());

CREATE POLICY "questions_insert_editor" ON "public"."questions"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_editor() AND public.is_write_allowed() AND (author_id = auth.uid())));

CREATE POLICY "questions_select_authenticated" ON "public"."questions"
  FOR SELECT
  TO "authenticated"
  USING (((status = 'published'::public.content_status) OR (author_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "questions_update_owner_moderator_admin" ON "public"."questions"
  FOR UPDATE
  TO "authenticated"
  USING ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()))
  WITH CHECK ((((author_id = auth.uid()) AND public.is_write_allowed()) OR public.is_moderator()));

CREATE POLICY "reactions_delete_owner_moderator_admin" ON "public"."reactions"
  FOR DELETE
  TO "authenticated"
  USING (((user_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "reactions_insert_user" ON "public"."reactions"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_authenticated_user() AND public.is_write_allowed() AND (user_id = auth.uid())));

CREATE POLICY "reactions_select_authenticated" ON "public"."reactions"
  FOR SELECT
  TO "authenticated"
  USING (((user_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "reactions_update_owner" ON "public"."reactions"
  FOR UPDATE
  TO "authenticated"
  USING (((user_id = auth.uid()) AND public.is_write_allowed()))
  WITH CHECK (((user_id = auth.uid()) AND public.is_write_allowed()));

CREATE POLICY "reports_delete_admin" ON "public"."reports"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "reports_insert_user" ON "public"."reports"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((public.is_write_allowed() AND ((reporter_id = auth.uid()) OR (reporter_id IS NULL))));

CREATE POLICY "reports_select_reporter_moderator_admin" ON "public"."reports"
  FOR SELECT
  TO "authenticated"
  USING (((reporter_id = auth.uid()) OR public.is_moderator()));

CREATE POLICY "reports_update_moderator_admin" ON "public"."reports"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_moderator())
  WITH CHECK (public.is_moderator());

CREATE POLICY "subcategories_delete_admin" ON "public"."subcategories"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "subcategories_insert_admin" ON "public"."subcategories"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "subcategories_select_active" ON "public"."subcategories"
  FOR SELECT
  TO "authenticated"
  USING (((is_active = true) OR public.is_admin()));

CREATE POLICY "subcategories_update_admin" ON "public"."subcategories"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON FUNCTION "public"."current_user_role"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."current_user_role"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."current_user_status"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."current_user_status"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_authenticated_user"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_authenticated_user"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_editor"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_editor"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_moderator"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_moderator"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_write_allowed"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."is_write_allowed"() TO "authenticated";
