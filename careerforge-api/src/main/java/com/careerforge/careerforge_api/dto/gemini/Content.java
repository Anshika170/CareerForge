package com.careerforge.careerforge_api.dto.gemini;

import java.util.List;

public class Content {

    private List<part> parts;

    public Content() {
    }

    public Content(List<part> parts) {
        this.parts = parts;
    }

    public List<part> getParts() {
        return parts;
    }

    public void setParts(List<part> parts) {
        this.parts = parts;
    }
}