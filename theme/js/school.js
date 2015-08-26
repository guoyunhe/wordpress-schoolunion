/* 
 * Copyright (C) 2015 Guo Yunhe <guoyunhebrave@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


jQuery(function () {
    // Open "Create School" popup
    jQuery('#create-school-click').click(function () {
        openPopup(jQuery('#school-create-popup'));
    });
    
    // Create school and open edit popup
    jQuery('#school-create-popup .next').click(function () {
        var request = {
            'action': 'create_school',
            'post_title': jQuery('#school-create-popup [name="post_title"]').val()
        };
        jQuery.ajax({
            url: ajaxurl,
            data: request,
            method: 'POST',
            dataType: 'json'
        }).done(function(response){
            if (response.succeed) {
                closePopup(jQuery('#school-create-popup'));
                jQuery('#school-edit-popup [name="post_title"]').val(request.post_title);
                jQuery('#school-edit-popup').data('post-id', response.post_id);
                openPopup(jQuery('#school-edit-popup'));
                // TODO: add it to school list
            } else {
                errorMessage(response.error_message);
            }
        });

        function errorMessage(message) {
            jQuery('#school-create-popup .error-message').html(message);
        }
    });


    // Edit popup
    
    // Initialize
    function initSchoolEditPopup(postId) {
        jQuery('#school-edit-popup').data('post-id', postId);
        
        // Fetch school information
        var request = {
            'action': 'view_school',
            'post_id': jQuery('#school-create-popup').data('post-id')
        };
        jQuery.ajax({
            url: ajaxurl,
            data: request,
            method: 'POST',
            dataType: 'json'
        }).done(function(response){
            if (response.succeed) {
                // Main picture
                jQuery('#school-edit-main-picture .main-picture').css('background-image',
                        'url(' + response.main_picture.url + ')');
                // Basic information
                // Post title
                jQuery('#school-edit-popup [name="post_title"]').val(response.post_title);
                jQuery('#school-edit-popup [name="short_name"]').val(response.short_name);
                jQuery('#school-edit-popup [name="country"]').val(response.country);
                jQuery('#school-edit-popup [name="city"]').val(response.city);
                // Staff
                jQuery('#school-edit-popup [name="coordinator_name"]').val(response.coordinator_name);
                jQuery('#school-edit-popup [name="coordinator_email"]').val(response.coordinator_email);
                jQuery('#school-edit-popup [name="tutor_name"]').val(response.tutor_name);
                jQuery('#school-edit-popup [name="tutor_email"]').val(response.tutor_email);
                // Description
                jQuery('#school-edit-popup [name="post_content"]').val(response.post_content);
                // Pictures
                // TODO...
            }
        });
    }
    
    // Edit main picture
    jQuery('#school-edit-popup .main-picture button').click(function () {
        jQuery('#school-edit-popup .main-picture input').click();
    });

    jQuery('#school-edit-popup .main-picture input').change(function () {
        var file_data = jQuery(this).prop('files')[0];
        var request = new FormData();
        request.append('action', 'edit_school_main_pictrue');
        request.append('main_picture', file_data);
        jQuery.ajax({
            url: ajaxurl,
            data: request,
            method: 'POST',
            dataType: 'json',
            processData: false,
            contentType: false
        }).done(function (response) {
            jQuery('#school-edit-popup .main-picture').css('background-image', 'url(' + response.main_picture.url + ')');
        });
    });
});