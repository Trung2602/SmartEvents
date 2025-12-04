package com.aws.controller;

import com.aws.pojo.Page;
import com.aws.services.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiPageController {

    @Autowired
    private PageService pageService;

    @GetMapping("/pages/{ownerUuid}")
    public ResponseEntity<org.springframework.data.domain.Page<Page>> getPagesByOwner(@PathVariable UUID ownerUuid,
              @RequestParam(defaultValue = "0") int page,
              @RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Page<Page> pages = pageService.getPagesByOwner(ownerUuid, page, size);
        return ResponseEntity.ok(pages);
    }

    @PostMapping("/page-update")
    public ResponseEntity<Page> createOrUpdatePage(@RequestBody Page page) {
        return ResponseEntity.ok(this.pageService.addOrUpdatePage(page));
    }

    @DeleteMapping("/page-delete/{uuid}")
    public ResponseEntity<?> deletePage(@PathVariable UUID uuid) {
        Page page = pageService.getPageByUuid(uuid);
        if (page != null) {
            pageService.deletePage(page);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pages")
    public ResponseEntity<org.springframework.data.domain.Page<Page>> getAllPages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        org.springframework.data.domain.Page<Page> pages = pageService.getAllPages(pageable);
        return ResponseEntity.ok(pages);
    }
}
